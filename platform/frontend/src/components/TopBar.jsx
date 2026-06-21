/**
 * TopBar — fixed:
 * FIX #10: Shows the actual active project from ProjectContext with a dropdown selector.
 */
import React from 'react';
import { useProject } from '../context/ProjectContext';

const TopBar = () => {
  const { projects, activeProject, setActiveProject } = useProject();

  return (
    <div
      className="glass-panel"
      style={{
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        borderBottom: '1px solid var(--glass-border)',
        flexShrink: 0,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Active Project:</span>
        <select
          value={activeProject?.id || ''}
          onChange={e => {
            const proj = projects.find(p => p.id === parseInt(e.target.value));
            if (proj) setActiveProject(proj);
          }}
          style={{
            background: 'var(--bg-surface)',
            color: 'var(--accent-cyan)',
            border: '1px solid var(--glass-border)',
            borderRadius: '4px',
            padding: '4px 8px',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          {projects.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        {activeProject && (
          <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
            Job# {activeProject.job_number} · Tax {((activeProject.tax_rate - 1) * 100).toFixed(0)}%
          </span>
        )}
      </div>
      <div style={{ color: 'var(--text-secondary)', fontSize: '13px', cursor: 'pointer' }}>
        🔔 Notifications
      </div>
    </div>
  );
};

export default TopBar;
