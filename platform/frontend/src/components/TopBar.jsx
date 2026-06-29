import React from 'react';
import { useProject } from '../context/ProjectContext';
import { Bell, Search, UserCircle, Settings } from 'lucide-react';

const TopBar = () => {
  const { projects, activeProject, setActiveProject } = useProject();

  return (
    <div
      className="glass-panel"
      style={{
        height: '70px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px',
        borderBottom: '1px solid var(--glass-border)',
        flexShrink: 0,
        background: 'rgba(24, 24, 27, 0.6)',
        backdropFilter: 'blur(20px)',
        zIndex: 90
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        
        {/* Project Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(0,0,0,0.2)', padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>Project</span>
          <select
            value={activeProject?.id || ''}
            onChange={e => {
              const proj = projects.find(p => p.id === parseInt(e.target.value));
              if (proj) setActiveProject(proj);
            }}
            style={{
              background: 'transparent',
              color: '#fff',
              border: 'none',
              outline: 'none',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '14px',
              fontFamily: 'Inter',
              appearance: 'none',
              paddingRight: '16px'
            }}
          >
            {projects.map(p => (
              <option key={p.id} value={p.id} style={{ background: '#18181b' }}>{p.name}</option>
            ))}
          </select>
        </div>

        {/* Project Metadata */}
        {activeProject && (
          <div style={{ display: 'flex', gap: '16px' }}>
            <span style={{ fontSize: '12px', background: 'rgba(139, 92, 246, 0.1)', padding: '4px 10px', borderRadius: '20px', color: '#A78BFA' }}>
              Job ID: {activeProject.job_number}
            </span>
            <span style={{ fontSize: '12px', background: 'rgba(6, 182, 212, 0.1)', padding: '4px 10px', borderRadius: '20px', color: '#67e8f9' }}>
              Tax Rate: {((activeProject.tax_rate - 1) * 100).toFixed(0)}%
            </span>
          </div>
        )}
      </div>

      {/* Right Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', color: 'var(--text-secondary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '8px 16px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <Search size={16} />
          <input type="text" placeholder="Search workspace..." style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', marginLeft: '8px', fontSize: '13px', width: '200px' }} />
        </div>
        
        <div style={{ display: 'flex', gap: '16px', cursor: 'pointer' }}>
          <Bell size={20} style={{ transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#fff'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'} />
          <Settings size={20} style={{ transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#fff'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'} />
          <UserCircle size={20} style={{ transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#fff'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'} />
        </div>
      </div>
    </div>
  );
};

export default TopBar;
