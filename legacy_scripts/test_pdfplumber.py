"""
Test script for pdfplumber extraction.
"""
import sys
sys.stdout.reconfigure(encoding='utf-8')
import pdfplumber

def test_extract(pdf_path):
    print(f"Extracting: {pdf_path}")
    with pdfplumber.open(pdf_path) as pdf:
        text = ""
        for page in pdf.pages:
            text += page.extract_text() + "\n"
        print(text)

if __name__ == "__main__":
    test_extract('Client/Cobia Cove/Invoices (3)/Invoices/68981012.pdf')
