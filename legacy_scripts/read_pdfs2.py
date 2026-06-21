import fitz

# Read a multi-page invoice
for inv_file in ["68981005.pdf", "68981025.pdf", "68981028.pdf"]:
    print("=" * 80)
    print(f"INVOICE: {inv_file}")
    print("=" * 80)
    doc = fitz.open(f"Client\\Cobia Cove\\Invoices (3)\\Invoices\\{inv_file}")
    for page in doc:
        print(page.get_text())
    doc.close()
    print()

# Also check PO
print("=" * 80)
print("PO: Cobia Cove Housewrap")
print("=" * 80)
doc = fitz.open(r"Client\Cobia Cove\Cobia Cove PO's\Cobia Cove Housewrap- Capsol (1).pdf")
for page in doc:
    print(page.get_text())
doc.close()
