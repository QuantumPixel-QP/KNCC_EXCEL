"""
Matcher service — fixed:
  FIX #6:  qty_multiplier is now returned AND the caller is expected to use it.
           The multiplier logic (2x6x1 vs 2x6x12) is correctly directional.
  FIX #11: Dimension regex is case-insensitive — matches 2x6x12 and 2X6X12.
  FIX #12: Score threshold lowered for "Each" items which have no dimensions.
           Also adds keyword match scoring for SYP/MCA/LVL/PT material types (from generate_requirements.py).
"""
import re


def classify_item_category(desc: str, item_code: str = "") -> str:
    desc = desc.upper()
    code = item_code.upper()
    if any(k in desc for k in ["LVL", "PSL", "GLB", "GLULAM", "LSL"]): return "lvl"
    if any(k in desc for k in ["OSB", "PLYWOOD", "PLY", "ZIP", "CDX", "GYPSUM", "SHEATHING"]): return "panels"
    if any(k in desc for k in ["SILL SEAL", "ADHESIVE", "TAPE", "FLASHING", "TYVEK",
                                "WRAP", "SEALANT", "CAULK", "DYNAFLEX", "THRESHOLD",
                                "BT20", "COMPOUND"]): return "each"
    if any(k in desc for k in ["SYP", "MCA", "TREATED", "LUMBER"]): return "lumber"
    if any(k in code for k in ["SYP", "MCA"]): return "lumber"
    if any(k in code for k in ["LVL", "PSL"]): return "lvl"
    if any(k in code for k in ["OSB", "PLY", "ZIP"]): return "panels"
    if any(k in code for k in ["SILL", "TAPE", "TYVEK", "CAULK", "ADHES"]): return "each"
    return "lumber"


def _material_type_bonus(inv_desc: str, mat_type_str: str) -> int:
    """
    FIX #12: Award bonus points for known material type keywords (from generate_requirements.py).
    Restores SYP/MCA/LVL/PT matching that was missing from the new matcher.
    """
    inv_desc = inv_desc.upper()
    mat = (mat_type_str or "").upper()
    score = 0
    pairs = [
        (["PT", "MCA"], ["PT", "MCA"]),
        (["SYP"], ["SYP"]),
        (["LVL"], ["LVL"]),
        (["OSB"], ["OSB"]),
        (["PLY", "PLYWOOD"], ["PLY"]),
        (["ZIP"], ["ZIP"]),
    ]
    for inv_keys, mat_keys in pairs:
        if any(k in inv_desc for k in inv_keys) and any(k in mat for k in mat_keys):
            score += 3
    return score


def match_material(invoice_item_desc: str, invoice_item_dims: str, invoice_item_code: str, materials: list) -> dict | None:
    """
    Finds the best matching material row for an invoice line item.

    FIX #6: Returns qty_multiplier so callers can correctly scale quantities.
            e.g. Invoice says 1 PC of 2x6x12, PO row is 2x6x1 → multiplier = 12.
    FIX #11: Dimension parse is case-insensitive.
    FIX #12: Each items use a lower threshold (10 vs 15) since they have no dimensions.
    """
    inv_category = classify_item_category(invoice_item_desc, invoice_item_code)

    # FIX #11: case-insensitive dimension parse
    inv_t, inv_w, inv_l = None, None, None
    dm = re.match(r'(\d+)[Xx](\d+)[Xx](\d+)', invoice_item_dims.strip())
    if dm:
        inv_t, inv_w, inv_l = int(dm.group(1)), int(dm.group(2)), int(dm.group(3))

    best_match = None
    best_score = 0

    for mat in materials:
        score = 0
        mat_category = str(mat.type).lower() if mat.type else ""

        if inv_category == mat_category:
            score += 10
        elif inv_category in mat_category or mat_category in inv_category:
            score += 5
        else:
            continue  # Category mismatch — skip entirely

        # Dimension matching (T, W, L)
        if inv_t is not None and mat.thickness == inv_t: score += 5
        if inv_w is not None and mat.width == inv_w:    score += 5
        if inv_l is not None and mat.length == inv_l:   score += 5

        # FIX #12: Material type keyword bonus (SYP, MCA, LVL, PT, etc.)
        score += _material_type_bonus(invoice_item_desc, mat.material_type or "")

        # Description word overlap
        desc_words = set((mat.material_type or "").upper().split())
        inv_words = set(invoice_item_desc.upper().split())
        common = desc_words & inv_words
        score += len(common) * 2

        if score > best_score:
            best_score = score
            best_match = mat

    # FIX #12: Lower threshold for "each" items (no dimensions = max dim score is 0)
    threshold = 10 if inv_category in ("each", "invoice") else 15

    if best_score >= threshold and best_match:
        # FIX #6: Compute quantity multiplier for dimension mismatches
        # e.g. invoice has 2x6x12 (1 piece = 12 ft), PO row is 2x6x1
        # → each invoice piece counts as 12 PO pieces
        qty_multiplier = 1.0
        if best_match.length and inv_l and best_match.length != inv_l:
            # inv_l / best_match.length gives the scale factor
            # (12 ft invoice / 1 ft PO-unit = 12 PO pieces per invoice piece)
            qty_multiplier = inv_l / best_match.length

        return {
            "match": best_match,
            "score": best_score,
            "qty_multiplier": qty_multiplier,
        }

    return None
