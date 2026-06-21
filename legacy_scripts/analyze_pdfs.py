"""
Deep analysis of all PDF formats to find reliable parsing patterns.
"""
import fitz
import os
import sys
sys.stdout.reconfigure(encoding='utf-8')

def analyze_pdf(path, label):
    print(f"\n{'='*80}")
    print(f"{label}: {os.path.basename(path)}")
    print(f"{'='*80}")
    doc = fitz.open(path)
    for i, page in enumerate(doc):
        text = page.get_text()
        print(f"--- Page {i+1} ---")
        print(text[:3000])
    doc.close()

# Analyze a diverse set of invoices 
base = r"Client\Cobia Cove\Invoices (3)\Invoices"
for inv in ["68981001.pdf", "68981005.pdf", "68981029.pdf", "68981040.pdf", "68981066.pdf", "68981102.pdf"]:
    analyze_pdf(os.path.join(base, inv), "COBIA INV")

# Willow Way invoices
base2 = r"Client\Willow way Village\Invoices"
for inv in ["60126001.pdf", "60126008.pdf", "60126017.pdf", "60126039.pdf"]:
    analyze_pdf(os.path.join(base2, inv), "WILLOW INV")

# More change orders
co_base = r"Client\Cobia Cove\Cobia Cove Change Orders"
for co in ["COBIA COVE CO 001.pdf", "COBIA CO #009.pdf", "Cobia CO #019.pdf"]:
    analyze_pdf(os.path.join(co_base, co), "COBIA CO")

# Willow Way PO
analyze_pdf(r"Client\Willow way Village\Willow way  Lumber PO.pdf", "WILLOW PO")
