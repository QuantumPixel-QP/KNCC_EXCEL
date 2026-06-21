"""
Deliveries router — complete implementation.
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List

from ..database import get_db
from ..models import Delivery, Material, Project
from ..dependencies import get_current_project

router = APIRouter()


@router.get("/{project_id}")
def get_deliveries(project: Project = Depends(get_current_project), db: Session = Depends(get_db)):
    """List all delivery records for a project, joined with material info."""
    results = (
        db.query(Delivery, Material)
        .join(Material, Delivery.material_id == Material.id)
        .filter(Material.project_id == project.id)
        .order_by(Delivery.ship_date.desc())
        .all()
    )
    return [
        {
            "id": d.id,
            "material_id": d.material_id,
            "material_type": m.material_type,
            "type": m.type,
            "invoice_number": d.invoice_number,
            "ship_date": d.ship_date.isoformat() if d.ship_date else None,
            "quantity": d.quantity,
            "qty_multiplier": d.qty_multiplier,
            "effective_qty": (d.quantity or 0) * (d.qty_multiplier or 1.0),
        }
        for d, m in results
    ]


@router.get("/{project_id}/progress")
def get_delivery_progress(project: Project = Depends(get_current_project), db: Session = Depends(get_db)):
    """Delivery % by material category (Lumber, Panels, LVL, Each)."""
    materials = db.query(Material).filter(Material.project_id == project.id).all()
    categories = {}
    for mat in materials:
        cat = (mat.type or "Other").strip()
        if cat not in categories:
            categories[cat] = {"ordered": 0, "delivered": 0, "cost_ordered": 0, "cost_delivered": 0}
        categories[cat]["ordered"] += mat.po_co_qty or mat.qty or 0
        categories[cat]["cost_ordered"] += mat.total_cost or 0

        deliveries = db.query(Delivery).filter(Delivery.material_id == mat.id).all()
        total_del = sum((d.quantity or 0) * (d.qty_multiplier or 1.0) for d in deliveries)
        categories[cat]["delivered"] += total_del
        # Approximate delivered cost ratio
        if mat.po_co_qty and mat.po_co_qty > 0:
            ratio = total_del / mat.po_co_qty
        else:
            ratio = 0
        categories[cat]["cost_delivered"] += (mat.total_cost or 0) * ratio

    result = []
    for cat, data in categories.items():
        pct = (data["delivered"] / data["ordered"] * 100) if data["ordered"] > 0 else 0
        result.append({
            "category": cat,
            "ordered": round(data["ordered"]),
            "delivered": round(data["delivered"]),
            "pct": round(pct, 1),
            "cost_ordered": round(data["cost_ordered"], 2),
            "cost_delivered": round(data["cost_delivered"], 2),
        })
    return result


@router.get("/{project_id}/timeline")
def get_delivery_timeline(project: Project = Depends(get_current_project), db: Session = Depends(get_db)):
    """Cumulative delivery quantities over time, grouped by date."""
    results = (
        db.query(
            func.date(Delivery.ship_date).label("date"),
            func.sum(Delivery.quantity * Delivery.qty_multiplier).label("qty"),
        )
        .join(Material, Delivery.material_id == Material.id)
        .filter(Material.project_id == project.id)
        .group_by(func.date(Delivery.ship_date))
        .order_by(func.date(Delivery.ship_date))
        .all()
    )
    cumulative = 0
    timeline = []
    for row in results:
        cumulative += row.qty or 0
        timeline.append({
            "date": str(row.date),
            "daily": round(row.qty or 0),
            "cumulative": round(cumulative),
        })
    return timeline
