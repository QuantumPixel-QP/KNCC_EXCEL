"""
Calculator service — fixed:
  FIX #4: Tax rate is now accepted as a parameter (from Project.tax_rate or parsed doc),
           NOT hardcoded to 1.06.
"""


def compute_material_totals(mat, tax_rate: float = 1.06) -> dict:
    """
    Compute LF/BF/cost totals for a material row.
    FIX #4: tax_rate passed in, defaults to 1.06 only as a last resort.
    """
    lf_pcs = 0
    bf_sf = 0
    total_cost = 0

    mat_type = str(mat.type).lower() if mat.type else ""

    if mat.length:
        lf_pcs = (mat.qty or 0) * mat.length

    if mat_type == "lumber":
        if mat.thickness and mat.width and mat.length:
            bf_sf = ((mat.qty or 0) * mat.thickness * mat.width * mat.length) / 12
        if mat.cost_mbf:
            total_cost = (bf_sf * mat.cost_mbf) / 1000

    elif mat_type == "panels":
        if mat.thickness and mat.width:
            bf_sf = (mat.qty or 0) * mat.thickness * mat.width
        if mat.cost_mbf:
            total_cost = (bf_sf * mat.cost_mbf) / 1000

    elif mat_type == "lvl":
        if mat.length:
            lf_pcs = (mat.qty or 0) * mat.length
        if mat.cost_mbf:
            total_cost = lf_pcs * mat.cost_mbf

    elif mat_type in ("each", "invoice"):
        if mat.cost_mbf:
            total_cost = (mat.qty or 0) * mat.cost_mbf

    total_cost_tax = total_cost * tax_rate

    return {
        "lf_pcs": round(lf_pcs, 4),
        "bf_sf": round(bf_sf, 4),
        "total_cost": round(total_cost, 2),
        "total_cost_tax": round(total_cost_tax, 2),
    }


def update_delivery_totals(mat, deliveries, tax_rate: float = 1.06) -> dict:
    """
    Compute delivered quantities and costs.
    FIX #4: tax_rate passed in.
    FIX #6: qty_multiplier is applied here when accumulating deliveries.
    """
    # deliveries is a list of Delivery ORM objects
    # Each delivery may carry a qty_multiplier from the matching step
    total_delivered = 0
    for d in deliveries:
        multiplier = getattr(d, "qty_multiplier", 1.0) or 1.0
        total_delivered += (d.quantity or 0) * multiplier

    delivered_lf = 0
    delivered_bf = 0
    delivered_cost = 0

    mat_type = str(mat.type).lower() if mat.type else ""

    if mat.length:
        delivered_lf = total_delivered * mat.length

    if mat_type == "lumber":
        if mat.thickness and mat.width and mat.length:
            delivered_bf = (total_delivered * mat.thickness * mat.width * mat.length) / 12
        if mat.cost_mbf:
            delivered_cost = (delivered_bf * mat.cost_mbf) / 1000

    elif mat_type == "panels":
        if mat.thickness and mat.width:
            delivered_bf = total_delivered * mat.thickness * mat.width
        if mat.cost_mbf:
            delivered_cost = (delivered_bf * mat.cost_mbf) / 1000

    elif mat_type == "lvl":
        if mat.cost_mbf:
            delivered_cost = delivered_lf * mat.cost_mbf

    elif mat_type in ("each", "invoice"):
        if mat.cost_mbf:
            delivered_cost = total_delivered * mat.cost_mbf

    delivered_cost_tax = delivered_cost * tax_rate

    total_cost_data = compute_material_totals(mat, tax_rate)
    total_cost = total_cost_data["total_cost"]
    pct_delivery = (delivered_cost / total_cost) if total_cost > 0 else 0

    return {
        "total_delivered": round(total_delivered, 4),
        "delivered_lf": round(delivered_lf, 4),
        "delivered_bf": round(delivered_bf, 4),
        "delivered_cost": round(delivered_cost, 2),
        "delivered_cost_tax": round(delivered_cost_tax, 2),
        "pct_delivery": round(pct_delivery, 4),
    }
