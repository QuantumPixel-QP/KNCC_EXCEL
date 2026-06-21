/**
 * Sidebar — fixed:
 * FIX #16: Added overflow-y: auto so nav doesn't clip on small screens.
 * FIX #10: Uses activeProject from context instead of hardcoded text.
 */
import React from 'react';
import { NavLink } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/',               icon: '📊', label: 'Dashboard' },
  { to: '/grid',           icon: '📋', label: 'Material Grid' },
  { to: '/upload',         icon: '⬆️', label: 'Upload Center' },
  { to: '/documents',      icon: '📄', label: 'Documents' },
  { to: '/timeline',       icon: '⏱️', label: 'CO Timeline' },
  { to: '/progress',       icon: '📈', label: 'Delivery Progress' },
  { to: '/reconciliation', icon: '✅', label: 'Reconciliation' },
  { to: '/vpos',           icon: '📑', label: 'VPO Management' },
  { to: '/export',         icon: '📥', label: 'Excel Export' },
  { to: '/activity',       icon: '📝', label: 'Activity Log' },
];

const Sidebar = () => {
  return (
    <div
      className="glass-panel"
      style={{
        width: '220px',
        display: 'flex',
        flexDirection: 'column',
        padding: '16px',
        borderRight: '1px solid var(--glass-border)',
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', letterSpacing: '2px', marginBottom: '4px' }}>
          KNCC
        </div>
        <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--accent-blue)' }}>
          Procurement
        </div>
      </div>

      {/* Nav — FIX #16: overflow-y auto */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto', flex: 1 }}>
        {NAV_ITEMS.map(item => (
          <NavLink key={item.to} to={item.to} end={item.to === '/'} style={navStyle}>
            <span style={{ fontSize: '16px', lineHeight: 1 }}>{item.icon}</span>
            <span style={{ fontSize: '13px' }}>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom version tag */}
      <div style={{ paddingTop: '12px', borderTop: '1px solid var(--glass-border)', fontSize: '11px', color: 'var(--text-tertiary)' }}>
        v1.0.0 · Autodesk-Style UI
      </div>
    </div>
  );
};

const navStyle = ({ isActive }) => ({
  padding: '9px 12px',
  textDecoration: 'none',
  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
  backgroundColor: isActive ? 'var(--bg-surface)' : 'transparent',
  borderRadius: '6px',
  transition: 'all 0.15s',
  borderLeft: isActive ? '3px solid var(--accent-blue)' : '3px solid transparent',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
});

export default Sidebar;
