import React, { useRef } from 'react';
import { UploadCloud, FileText, FileSpreadsheet, CheckCircle2 } from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import './UploadCenter.css';

export default function UploadCenter() {
  const { documents, addDocument } = usePlatform();
  const fileInputRef = useRef(null);

  // Fallback to initial mock data if no documents exist in state yet
  const displayDocs = documents.length > 0 ? documents : [
    { id: 1, name: 'Structural_Plans_v2.pdf', size: '14.2 MB', type: 'pdf', date: 'Today, 10:45 AM' },
    { id: 2, name: 'Material_Takeoff_July.xlsx', size: '2.4 MB', type: 'excel', date: 'Yesterday, 3:20 PM' },
    { id: 3, name: 'Site_Safety_Guidelines.pdf', size: '8.1 MB', type: 'pdf', date: 'Mon, 9:00 AM' },
  ];

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const isPdf = file.name.toLowerCase().endsWith('.pdf');
      const type = isPdf ? 'pdf' : 'excel';
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      
      addDocument({
        name: file.name,
        size: `${sizeMB} MB`,
        type: type,
        date: 'Just now'
      });
    }
  };

  return (
    <div className="upload-container">
      <div className="upload-header">
        <h1 className="upload-title">Upload Center</h1>
        <p className="upload-subtitle">Drag and drop construction plans, Excel data, or specifications.</p>
      </div>

      <div className="drop-zone" onClick={() => fileInputRef.current?.click()}>
        <input 
          type="file" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          onChange={handleFileUpload}
          accept=".pdf,.xlsx,.csv,.dwg"
        />
        <UploadCloud size={64} className="drop-icon" />
        <h3 className="drop-title">Select a file or drag and drop here</h3>
        <p className="drop-desc">PDF, XLSX, CSV, or DWG, file size no more than 50MB</p>
        <button className="browse-btn" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>Browse Files</button>
      </div>

      <h3 className="recent-uploads-title">Recent Uploads</h3>
      <div className="upload-list">
        {displayDocs.map(file => (
          <div key={file.id} className="upload-item">
            <div className="upload-info">
              <div className={`file-icon ${file.type === 'pdf' ? 'file-pdf' : 'file-excel'}`}>
                {file.type === 'pdf' ? <FileText size={24} /> : <FileSpreadsheet size={24} />}
              </div>
              <div className="file-details">
                <h4>{file.name}</h4>
                <p>{file.size} • {file.date}</p>
              </div>
            </div>
            <div className="upload-status">
              <CheckCircle2 size={18} /> Processed
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
