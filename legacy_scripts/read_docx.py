import sys
sys.stdout.reconfigure(encoding='utf-8')
from docx import Document

doc = Document(r'Client\KNCC_Combined_Business_Requirements.docx')
for para in doc.paragraphs:
    if para.text.strip():
        print(para.text)
