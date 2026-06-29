import React, { useState } from 'react';
import { Search, Filter, Download } from 'lucide-react';
import './MaterialGrid.css';

export default function MaterialGrid() {
  const [searchTerm, setSearchTerm] = useState('');

  const materials = [
    { id: 'MAT-1001', name: 'Portland Cement (Type I/II)', category: 'Concrete', stock: 450, unit: 'Bags', status: 'In Stock' },
    { id: 'MAT-1002', name: 'Rebar #5 (60 Grade)', category: 'Steel', stock: 120, unit: 'Tons', status: 'Low Stock' },
    { id: 'MAT-1003', name: 'Lumber 2x4x8', category: 'Wood', stock: 0, unit: 'Pieces', status: 'Out of Stock' },
    { id: 'MAT-1004', name: 'Drywall 1/2" 4x8', category: 'Interior', stock: 320, unit: 'Sheets', status: 'In Stock' },
    { id: 'MAT-1005', name: 'Copper Pipe 3/4"', category: 'Plumbing', stock: 85, unit: 'Lengths', status: 'Low Stock' },
    { id: 'MAT-1006', name: 'THHN Wire 12 AWG', category: 'Electrical', stock: 5000, unit: 'Feet', status: 'In Stock' },
    { id: 'MAT-1007', name: 'Roofing Shingles', category: 'Exterior', stock: 45, unit: 'Squares', status: 'Low Stock' },
  ];

  const getStatusClass = (status) => {
    switch (status) {
      case 'In Stock': return 'status-instock';
      case 'Low Stock': return 'status-low';
      case 'Out of Stock': return 'status-out';
      default: return '';
    }
  };

  const filteredMaterials = materials.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grid-container">
      <div className="grid-header">
        <div>
          <h1 className="grid-title">Material Inventory</h1>
        </div>
        <div className="grid-controls">
          <div style={{ position: 'relative' }}>
            <Search size={18} color="#a1a1aa" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              className="search-input" 
              placeholder="Search materials by name or ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>
          <button style={{ padding: '0.75rem', background: 'rgba(24,24,27,0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#fff', cursor: 'pointer' }}>
            <Filter size={18} />
          </button>
          <button style={{ padding: '0.75rem 1.5rem', background: '#3B82F6', border: 'none', borderRadius: '6px', color: '#fff', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <Download size={18} /> Export
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Material ID</th>
              <th>Description</th>
              <th>Category</th>
              <th>Stock Level</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredMaterials.map(item => (
              <tr key={item.id}>
                <td style={{ fontFamily: 'monospace', color: '#3B82F6' }}>{item.id}</td>
                <td style={{ fontWeight: 500 }}>{item.name}</td>
                <td style={{ color: '#a1a1aa' }}>{item.category}</td>
                <td>{item.stock} {item.unit}</td>
                <td>
                  <span className={`status-badge ${getStatusClass(item.status)}`}>
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
