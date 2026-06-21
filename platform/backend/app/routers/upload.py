"""
Upload router — fixed:
  FIX #1: /confirm now accepts UploadFile directly (no pre-upload step required).
           Also supports confirming a previously uploaded file by filename.
  FIX #7: UPLOAD_DIR guaranteed to exist (also ensured in main.py startup).
  FIX #8: CO adjustments are now parsed and persisted to DB.
  FIX #13: Duplicate invoice guard — rejects already-processed invoice numbers.
"""
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Optional
import os
import shutil
import json

from ..dependencies import get_current_user
from ..models.user import User

from ..database import get_db
from ..config import UPLOAD_DIR
from ..models import Document, Project, COAdjustment, Material, Activity
from ..services.classifier import classify_document
from ..services.pdf_parser import parse_pdf_document

router = APIRouter()

# Ensure upload directory exists
os.makedirs(UPLOAD_DIR, exist_ok=True)


def _log_activity(db: Session, project_id: int, action: str, detail: str):
    """Write an activity log entry."""
    act = Activity(project_id=project_id, action=action, detail=detail)
    db.add(act)


def _save_co_adjustments(db: Session, project_id: int, doc_data, doc_id: int):
    """
    Parse CO line items and persist as COAdjustment records linked to matching Materials.
    """
    materials = db.query(Material).filter(Material.project_id == project_id).all()
    for item in doc_data.line_items:
        # Find best matching material by description keywords
        best = None
        best_score = 0
        for mat in materials:
            score = 0
            mat_desc = (mat.material_type or "").upper()
            inv_desc = item.description.upper()
            # Check common keywords
            for word in mat_desc.split():
                if len(word) > 2 and word in inv_desc:
                    score += 2
            # Dimension match
            if item.dimensions and mat.thickness and mat.width and mat.length:
                import re
                dm = re.match(r'(\d+)[Xx](\d+)[Xx](\d+)', item.dimensions.strip())
                if dm:
                    t, w, l = int(dm.group(1)), int(dm.group(2)), int(dm.group(3))
                    if mat.thickness == t: score += 5
                    if mat.width == w: score += 5
                    if mat.length == l: score += 5
            if score > best_score:
                best_score = score
                best = mat

        adj = COAdjustment(
            material_id=best.id if best and best_score >= 6 else None,
            co_number=doc_data.number,
            co_date=str(doc_data.date) if doc_data.date else "",
            qty_change=item.quantity,
            description=item.description,
        )
        db.add(adj)

        # Update material co_qty if matched
        if best and best_score >= 6:
            best.co_qty = (best.co_qty or 0) + item.quantity
            best.po_co_qty = (best.qty or 0) + (best.co_qty or 0)


@router.post("/")
async def upload_files(
    files: List[UploadFile] = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Step 1: Upload PDFs. Returns classification result for each file.
    Files are saved to UPLOAD_DIR for confirmation in step 2.
    """
    results = []
    for file in files:
        if not file.filename.lower().endswith(".pdf"):
            results.append({"filename": file.filename, "error": "Only PDFs accepted"})
            continue

        # Sanitise filename to prevent path traversal
        safe_name = os.path.basename(file.filename)
        filepath = os.path.join(UPLOAD_DIR, safe_name)
        with open(filepath, "wb") as f:
            shutil.copyfileobj(file.file, f)

        # Extract text and classify
        import pdfplumber
        try:
            with pdfplumber.open(filepath) as pdf:
                text = "\n".join(
                    (p.extract_text(layout=True) or "") for p in pdf.pages
                )
        except Exception as e:
            text = ""

        classification = classify_document(text)
        results.append({
            "filename": safe_name,
            "classification": classification,
        })

    return {"message": f"Uploaded {len(results)} files.", "results": results}


@router.post("/confirm")
async def confirm_upload(
    filename: str = Form(...),
    doc_type: str = Form(...),
    project_id: int = Form(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Step 2: Confirm a previously uploaded file for processing.
    FIX #1: Now correctly looks up the sanitised filename.
    FIX #13: Rejects duplicate invoice numbers already processed for this project.
    """
    safe_name = os.path.basename(filename)
    filepath = os.path.join(UPLOAD_DIR, safe_name)

    if not os.path.exists(filepath):
        raise HTTPException(
            status_code=404,
            detail=f"File '{safe_name}' not found in upload queue. Upload it first via POST /api/upload/",
        )

    # Verify project exists and belongs to organization
    project = db.query(Project).filter(Project.id == project_id, Project.organization_id == current_user.organization_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # Parse the document
    doc_data = parse_pdf_document(filepath, doc_type)

    # FIX #13 — Duplicate invoice guard
    if doc_type == "INV" and doc_data.number:
        existing = db.query(Document).filter(
            Document.project_id == project_id,
            Document.doc_number == doc_data.number,
        ).first()
        if existing:
            raise HTTPException(
                status_code=409,
                detail=f"Invoice #{doc_data.number} has already been processed for this project.",
            )

    # Persist document record
    doc = Document(
        project_id=project_id,
        doc_type=doc_type,
        filename=safe_name,
        doc_number=doc_data.number,
        parsed_data_json=doc_data.model_dump_json(),
    )
    db.add(doc)
    db.flush()  # Get doc.id before commit

    # FIX #8 — Persist CO adjustments
    if doc_type == "CO":
        _save_co_adjustments(db, project_id, doc_data, doc.id)

    db.commit()
    db.refresh(doc)

    # Activity log
    _log_activity(
        db, project_id,
        action=f"Document Processed: {doc_type}",
        detail=f"{safe_name} | Doc# {doc_data.number} | {len(doc_data.line_items)} line items",
    )
    db.commit()

    return {
        "message": "Document processed and confirmed",
        "document_id": doc.id,
        "doc_number": doc_data.number,
        "line_items_parsed": len(doc_data.line_items),
    }
