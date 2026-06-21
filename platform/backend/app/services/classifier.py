import re

def classify_document(text: str) -> dict:
    text_upper = text.upper()
    doc_type = "UNKNOWN"
    project = "Unknown"
    confidence = 0.0

    if "COBIA COVE" in text_upper:
        project = "Cobia Cove"
    elif "WILLOW WAY" in text_upper:
        project = "Willow Way"

    if "CHANGE ORDER" in text_upper or "CO #" in text_upper:
        doc_type = "CO"
        confidence = 0.95
    elif "INVOICE NO" in text_upper or re.search(r'INVOICE DATE', text_upper):
        doc_type = "INV"
        confidence = 0.90
    elif "PURCHASE ORDER" in text_upper or "P.O." in text_upper:
        doc_type = "PO"
        confidence = 0.85

    return {
        "doc_type": doc_type,
        "project_name": project,
        "confidence": confidence
    }
