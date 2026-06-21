import fitz  # pymupdf

# Read sample invoice
print("=" * 80)
print("SAMPLE INVOICE: 68981012.pdf (Cobia Cove)")
print("=" * 80)
doc = fitz.open(r"Client\Cobia Cove\Invoices (3)\Invoices\68981012.pdf")
for page in doc:
    print(page.get_text())
doc.close()

print("\n" + "=" * 80)
print("SAMPLE INVOICE: 68981005.pdf (Cobia Cove)")
print("=" * 80)
doc = fitz.open(r"Client\Cobia Cove\Invoices (3)\Invoices\68981005.pdf")
for page in doc:
    print(page.get_text())
doc.close()

print("\n" + "=" * 80)
print("SAMPLE PO: Cobia Cove - Capsol - 01.15.2025 - Rev0.pdf")
print("=" * 80)
doc = fitz.open(r"Client\Cobia Cove\Cobia Cove PO's\Cobia Cove - Capsol - 01.15.2025 - Rev0.pdf")
for page in doc:
    print(page.get_text())
doc.close()

print("\n" + "=" * 80)
print("SAMPLE CO: COBIA CO #007.pdf")
print("=" * 80)
doc = fitz.open(r"Client\Cobia Cove\Cobia Cove Change Orders\COBIA CO #007.pdf")
for page in doc:
    print(page.get_text())
doc.close()

print("\n" + "=" * 80)
print("SAMPLE INVOICE (Willow Way): 60126001.pdf")
print("=" * 80)
doc = fitz.open(r"Client\Willow way Village\Invoices\60126001.pdf")
for page in doc:
    print(page.get_text())
doc.close()

print("\n" + "=" * 80)
print("SAMPLE CO (Willow Way): WILLOW WAY CO 001.pdf")
print("=" * 80)
doc = fitz.open(r"Client\Willow way Village\Willow Way Village CO's\WILLOW WAY CO 001.pdf")
for page in doc:
    print(page.get_text())
doc.close()
