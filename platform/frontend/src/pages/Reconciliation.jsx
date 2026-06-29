import React from 'react';
import { Download } from 'lucide-react';
import './Reconciliation.css';

export default function Reconciliation() {
  const budgetItems = [
    { category: 'Concrete Materials', budget: 150000, actual: 142000 },
    { category: 'Structural Steel', budget: 280000, actual: 295000 },
    { category: 'Lumber & Wood', budget: 75000, actual: 75000 },
    { category: 'Plumbing Fixtures', budget: 90000, actual: 82500 },
    { category: 'Electrical Wiring', budget: 110000, actual: 128000 },
  ];

  const totalBudget = budgetItems.reduce((acc, item) => acc + item.budget, 0);
  const totalActual = budgetItems.reduce((acc, item) => acc + item.actual, 0);
  const variance = totalBudget - totalActual;

  const formatMoney = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="recon-container">
      <div className="recon-header">
        <div>
          <h1 className="recon-title">Budget Reconciliation</h1>
          <p style={{ color: '#a1a1aa', margin: 0 }}>Compare estimated budgets vs. actual expenditures.</p>
        </div>
        <button style={{ padding: '0.75rem 1.5rem', background: '#3B82F6', border: 'none', borderRadius: '6px', color: '#fff', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
          <Download size={18} /> Export Report
        </button>
      </div>

      <div className="recon-stats">
        <div className="stat-box">
          <div className="stat-label">Total Budget</div>
          <div className="stat-value">{formatMoney(totalBudget)}</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Total Actual</div>
          <div className="stat-value">{formatMoney(totalActual)}</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Overall Variance</div>
          <div className={`stat-value ${variance >= 0 ? 'under' : 'over'}`}>
            {variance >= 0 ? '+' : ''}{formatMoney(variance)}
          </div>
        </div>
      </div>

      <div className="recon-table-container">
        <table className="recon-table">
          <thead>
            <tr>
              <th>Cost Category</th>
              <th>Budgeted Cost</th>
              <th>Actual Cost</th>
              <th>Variance</th>
              <th style={{ width: '30%' }}>Utilization</th>
            </tr>
          </thead>
          <tbody>
            {budgetItems.map(item => {
              const itemVariance = item.budget - item.actual;
              const utilPercent = Math.min((item.actual / item.budget) * 100, 100);
              const isOver = item.actual > item.budget;
              
              return (
                <tr key={item.category}>
                  <td style={{ fontWeight: 500 }}>{item.category}</td>
                  <td>{formatMoney(item.budget)}</td>
                  <td>{formatMoney(item.actual)}</td>
                  <td style={{ color: itemVariance >= 0 ? '#10B981' : '#EF4444', fontWeight: 600 }}>
                    {itemVariance >= 0 ? '+' : ''}{formatMoney(itemVariance)}
                  </td>
                  <td>
                    <div className="bar-wrapper">
                      <div className="bar-bg">
                        <div 
                          className="bar-fill" 
                          style={{ width: `${utilPercent}%`, background: isOver ? '#EF4444' : '#3B82F6' }}
                        ></div>
                      </div>
                      <span style={{ fontSize: '0.85rem', color: isOver ? '#EF4444' : '#a1a1aa' }}>
                        {Math.round((item.actual / item.budget) * 100)}%
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
