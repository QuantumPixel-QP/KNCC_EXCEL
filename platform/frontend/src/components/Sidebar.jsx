import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Table, UploadCloud, FileText, Clock, TrendingUp, CheckCircle, FileCheck, Download, Activity } from 'lucide-react';

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
      <div style={{ marginBottom: '32px', paddingLeft: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)' }} />
          <div style={{ fontSize: '18px', fontWeight: 800, color: '#fff', fontFamily: 'Outfit', letterSpacing: '0.05em' }}>
            QUANTUM
          </div>
        </div>
        <div style={{ fontSize: '11px', color: 'var(--accent-cyan)', letterSpacing: '1px', marginTop: '4px', textTransform: 'uppercase', fontWeight: 600 }}>
          Enterprise Core
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
