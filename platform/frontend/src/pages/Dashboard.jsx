import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Activity, BarChart2, Package, TrendingUp, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import './Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();

  const kpis = [
    { title: 'Total Deliveries (This Week)', value: '124', trend: '+14%', isPositive: true, icon: <Package size={20} color="#3B82F6" />, bg: 'rgba(59, 130, 246, 0.1)' },
    { title: 'Budget Variance', value: '-$12,450', trend: '-2.4%', isPositive: true, icon: <TrendingUp size={20} color="#10B981" />, bg: 'rgba(16, 185, 129, 0.1)' },
    { title: 'Active Change Orders', value: '7', trend: '+2', isPositive: false, icon: <AlertCircle size={20} color="#F59E0B" />, bg: 'rgba(245, 158, 11, 0.1)' },
    { title: 'Site Reports Logged', value: '42', trend: '100%', isPositive: true, icon: <CheckCircle2 size={20} color="#8B5CF6" />, bg: 'rgba(139, 92, 246, 0.1)' },
  ];

  const mockChartData = [
    { label: 'Mon', height: '40%' },
    { label: 'Tue', height: '65%' },
    { label: 'Wed', height: '45%' },
    { label: 'Thu', height: '80%' },
    { label: 'Fri', height: '55%' },
    { label: 'Sat', height: '30%' },
    { label: 'Sun', height: '20%' },
  ];

  const activities = [
    { id: 1, action: 'Delivery #4892 received at Gate B', time: '10 mins ago', color: '#10B981' },
    { id: 2, action: 'Change Order #CO-004 approved by PM', time: '1 hour ago', color: '#F59E0B' },
    { id: 3, action: 'Concrete pour #4 completed', time: '3 hours ago', color: '#3B82F6' },
    { id: 4, action: 'Safety incident reported in Zone C', time: '5 hours ago', color: '#EF4444' },
    { id: 5, action: 'Daily Site Report generated', time: 'Yesterday, 5:00 PM', color: '#8B5CF6' },
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Welcome back, {user?.name || 'Engineer'}</h1>
          <p className="dashboard-subtitle">Here is what is happening on site today.</p>
        </div>
        <button style={{
          padding: '0.75rem 1.5rem',
          background: 'linear-gradient(135deg, #F59E0B, #3B82F6)',
          border: 'none',
          borderRadius: '6px',
          color: '#fff',
          fontWeight: 600,
          cursor: 'pointer'
        }}>
          Generate Report
        </button>
      </div>

      {/* KPI Row */}
      <div className="kpi-grid">
        {kpis.map((kpi, index) => (
          <div key={index} className="kpi-card">
            <div className="kpi-header">
              <span className="kpi-title">{kpi.title}</span>
              <div className="kpi-icon" style={{ background: kpi.bg }}>
                {kpi.icon}
              </div>
            </div>
            <div className="kpi-value">{kpi.value}</div>
            <div className={`kpi-trend ${kpi.isPositive ? 'trend-up' : 'trend-down'}`}>
              {kpi.trend} from last week
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-main-grid">
        {/* Main Chart Panel */}
        <div className="panel">
          <div className="panel-title">Material Deliveries vs Schedule</div>
          <div className="mock-chart">
            {mockChartData.map((data, index) => (
              <div key={index} className="chart-bar-container">
                <div className="chart-bar" style={{ height: data.height }}></div>
                <span className="chart-label">{data.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Feed Panel */}
        <div className="panel">
          <div className="panel-title">Recent Activity</div>
          <div className="activity-feed">
            {activities.map(activity => (
              <div key={activity.id} className="activity-item">
                <div className="activity-dot" style={{ background: activity.color }}></div>
                <div className="activity-content">
                  <p>{activity.action}</p>
                  <span className="activity-time">
                    <Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />
                    {activity.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
