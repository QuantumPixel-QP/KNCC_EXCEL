import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Table, UploadCloud, FileText, Clock, TrendingUp, CheckCircle, FileCheck, Download, Activity } from 'lucide-react';
import logo from '../assets/logo.png';

const NAV_ITEMS = [
  { to: '/',               icon: <LayoutDashboard size={18} />, label: 'Workspace' },
  { to: '/grid',           icon: <Table size={18} />, label: 'Material Grid' },
  { to: '/upload',         icon: <UploadCloud size={18} />, label: 'Upload Center' },
  { to: '/documents',      icon: <FileText size={18} />, label: 'Documents' },
  { to: '/timeline',       icon: <Clock size={18} />, label: 'CO Timeline' },
  { to: '/progress',       icon: <TrendingUp size={18} />, label: 'Delivery Progress' },
  { to: '/reconciliation', icon: <CheckCircle size={18} />, label: 'Reconciliation' },
  { to: '/vpos',           icon: <FileCheck size={18} />, label: 'VPO Management' },
  { to: '/export',         icon: <Download size={18} />, label: 'Excel Export' },
  { to: '/activity',       icon: <Activity size={18} />, label: 'Activity Log' },
];

const Sidebar = () => {
  return (
    <div
      className="glass-panel"
      style={{
        width: '240px',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 16px',
        borderRight: '1px solid var(--glass-border)',
        flexShrink: 0,
        background: 'rgba(9, 9, 11, 0.8)',
        zIndex: 100
      }}
    >
      {/* Logo */}
      <div style={{ marginBottom: '32px', paddingLeft: '8px', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <img src={logo} alt="KNCC Logo" style={{ width: '32px', height: '32px', borderRadius: '4px', objectFit: 'contain' }} />
        <div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: '#fff', fontFamily: 'Outfit', letterSpacing: '0.05em' }}>
            KNCC
          </div>
          <div style={{ fontSize: '11px', color: 'var(--accent-cyan)', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 600 }}>
            Enterprise
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px', overflowY: 'auto', flex: 1 }}>
        {NAV_ITEMS.map(item => (
          <NavLink key={item.to} to={item.to === '/' ? '/dashboard' : item.to} style={navStyle}>
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'inherit' }}>{item.icon}</span>
            <span style={{ fontSize: '14px', fontFamily: 'Inter', fontWeight: 500 }}>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Quantum Pixel Footer */}
      <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '1px' }}>
          A Quantum Pixel Product
        </div>
      </div>
    </div>
  );
};

const navStyle = ({ isActive }) => ({
  padding: '12px 16px',
  textDecoration: 'none',
  color: isActive ? '#fff' : 'var(--text-secondary)',
  backgroundColor: isActive ? 'rgba(139, 92, 246, 0.15)' : 'transparent',
  borderRadius: '12px',
  transition: 'all 0.2s ease',
  border: '1px solid',
  borderColor: isActive ? 'rgba(139, 92, 246, 0.3)' : 'transparent',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  boxShadow: isActive ? '0 4px 12px rgba(139, 92, 246, 0.1)' : 'none'
});

export default Sidebar;
