import React from 'react';
import { Download, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';
import { usePlatform } from '../context/PlatformContext';
import './ExcelExport.css';

export default function ExcelExport() {
  const { activeProject, pos, invoices, cos } = usePlatform();

  const handleExport = () => {
    // 1. Create a new Workbook
    const wb = XLSX.utils.book_new();

    // 2. Prepare the Header / Metadata Rows
    const companyHeader = [
      ["[ KNCC LOGO ]", "KNCC Construction - Official Project Report"],
      [],
      ["Project Name:", activeProject?.name || "N/A"],
      ["Location:", activeProject?.location || "N/A"],
      ["Client:", activeProject?.client || "N/A"],
      ["Budget:", `$${activeProject?.budget || "0"}`],
      ["Export Date:", new Date().toLocaleDateString()],
      []
    ];

    // 3. Prepare PO Data
    const poHeaderRow = ["--- PURCHASE ORDERS ---"];
    const poColumns = ["PO ID", "Vendor", "Description", "Amount", "Status"];
    const poData = pos.map(po => [po.id, po.vendor, po.description, po.amount, po.status]);

    // 4. Prepare Invoice Data
    const invHeaderRow = ["--- INVOICES ---"];
    const invColumns = ["Invoice ID", "Against PO", "Amount", "Date", "Status"];
    const invData = invoices.map(inv => [inv.id, inv.poId, inv.amount, inv.date, inv.status]);

    // 5. Prepare CO Data
    const coHeaderRow = ["--- CHANGE ORDERS ---"];
    const coColumns = ["CO ID", "Title", "Cost Impact", "Date", "Status", "Description"];
    const coData = cos.map(co => [co.id, co.title, co.cost, co.date, co.status, co.desc]);

    // Combine all data into one single sheet (Report layout)
    const finalData = [
      ...companyHeader,
      poHeaderRow,
      poColumns,
      ...poData,
      [],
      invHeaderRow,
      invColumns,
      ...invData,
      [],
      coHeaderRow,
      coColumns,
      ...coData
    ];

    const ws = XLSX.utils.aoa_to_sheet(finalData);

    // Some simple column width formatting
    ws['!cols'] = [
      { wch: 15 }, // A
      { wch: 30 }, // B
      { wch: 40 }, // C
      { wch: 15 }, // D
      { wch: 15 }, // E
      { wch: 50 }, // F
    ];

    XLSX.utils.book_append_sheet(wb, ws, "Project Report");

    // 6. Download the file
    XLSX.writeFile(wb, `KNCC_Report_${activeProject?.name?.replace(/\s+/g, '_') || 'Project'}.xlsx`);
  };

  return (
    <div className="export-container">
      <div className="export-card">
        <FileSpreadsheet size={64} className="export-icon" />
        <h1 className="export-title">Generate Master Excel Report</h1>
        <p className="export-desc">
          Download a comprehensive, formatting-preserved Excel document containing all 
          Purchase Orders, Invoices, and Change Orders for this project. 
          The document will include the KNCC logo placeholder, company name, and project metadata in the header.
        </p>
        
        <button className="export-btn" onClick={handleExport}>
          <Download size={24} /> Download .xlsx
        </button>

        <div className="data-summary">
          <div className="summary-item">
            <span className="summary-label">POs Tracked</span>
            <span className="summary-value">{pos.length}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Invoices Logged</span>
            <span className="summary-value">{invoices.length}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Active COs</span>
            <span className="summary-value">{cos.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
