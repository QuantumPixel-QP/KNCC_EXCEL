import React, { useState } from 'react';
import { Folder, FileText, FileImage, FileSpreadsheet, Search, Plus } from 'lucide-react';
import './DocumentViewer.css';

export default function DocumentViewer() {
  const [activeFolder, setActiveFolder] = useState('Drawings');

  const folders = ['Drawings', 'Specifications', 'Contracts', 'RFI Responses', 'Safety Manuals'];

  const files = {
    'Drawings': [
      { id: 1, name: 'A-101_FloorPlan.pdf', size: '2.4 MB', type: 'pdf' },
      { id: 2, name: 'S-201_Foundation.pdf', size: '5.1 MB', type: 'pdf' },
      { id: 3, name: 'E-301_Lighting.pdf', size: '1.8 MB', type: 'pdf' },
      { id: 4, name: 'Site_Render_Final.png', size: '12.4 MB', type: 'image' },
    ],
    'Specifications': [
      { id: 5, name: 'Concrete_Specs_v3.pdf', size: '1.2 MB', type: 'pdf' },
      { id: 6, name: 'Steel_Tolerances.pdf', size: '0.8 MB', type: 'pdf' },
    ]
  };

  const currentFiles = files[activeFolder] || [];

  return (
    <div className="doc-container">
      <div className="doc-header">
        <h1 className="doc-title">Document Control</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} color="#a1a1aa" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Search documents..." 
              style={{ background: 'rgba(24,24,27,0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '0.75rem 1rem 0.75rem 2.5rem', color: '#fff', width: '250px' }}
            />
          </div>
          <button style={{ padding: '0.75rem 1.5rem', background: '#3B82F6', border: 'none', borderRadius: '6px', color: '#fff', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <Plus size={18} /> New Folder
          </button>
        </div>
      </div>

      <div className="doc-layout">
        <div className="doc-sidebar">
          <div style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', fontWeight: 600, color: '#a1a1aa' }}>
            FOLDERS
          </div>
          <ul className="folder-list">
            {folders.map(folder => (
              <li 
                key={folder} 
                className={`folder-item ${activeFolder === folder ? 'active' : ''}`}
                onClick={() => setActiveFolder(folder)}
              >
                <Folder size={18} fill={activeFolder === folder ? '#3B82F6' : 'none'} />
                {folder}
              </li>
            ))}
          </ul>
        </div>

        <div className="doc-main">
          {currentFiles.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#a1a1aa', marginTop: '4rem' }}>
              <Folder size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
              <p>This folder is empty.</p>
            </div>
          ) : (
            currentFiles.map(file => (
              <div key={file.id} className="file-card">
                {file.type === 'pdf' ? (
                  <FileText size={48} className="file-card-icon" />
                ) : file.type === 'image' ? (
                  <FileImage size={48} className="file-card-icon" style={{ color: '#10B981' }} />
                ) : (
                  <FileSpreadsheet size={48} className="file-card-icon" style={{ color: '#F59E0B' }} />
                )}
                <div className="file-card-name">{file.name}</div>
                <div className="file-card-size">{file.size}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
