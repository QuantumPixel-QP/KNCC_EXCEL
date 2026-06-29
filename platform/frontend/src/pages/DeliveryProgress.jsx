import React from 'react';
import { Truck, MapPin, Search } from 'lucide-react';
import './DeliveryProgress.css';

export default function DeliveryProgress() {
  const deliveries = [
    { id: 'SHP-9021', vendor: 'Cemex', material: 'Type II Cement (400 Bags)', origin: 'Plant B', destination: 'Gate 2', status: 'In Transit', progress: 65, color: '#3B82F6', eta: 'Today, 2:30 PM' },
    { id: 'SHP-9022', vendor: 'Nucor Steel', material: 'Rebar #5 (20 Tons)', origin: 'Mill 4', destination: 'Laydown Yard A', status: 'Arriving Soon', progress: 90, color: '#F59E0B', eta: 'Today, 11:15 AM' },
    { id: 'SHP-9023', vendor: 'Local Lumber Co', material: '2x4 Studs (800 pcs)', origin: 'Warehouse', destination: 'Gate 1', status: 'Delivered', progress: 100, color: '#10B981', eta: 'Delivered 8:00 AM' },
    { id: 'SHP-9024', vendor: 'Trane', material: 'RTU HVAC Units (2)', origin: 'Distribution Center', destination: 'Roof Hoist', status: 'In Transit', progress: 30, color: '#3B82F6', eta: 'Tomorrow, 9:00 AM' },
  ];

  const getStatusClass = (status) => {
    switch (status) {
      case 'In Transit': return 'status-transit';
      case 'Arriving Soon': return 'status-arriving';
      case 'Delivered': return 'status-delivered';
      default: return '';
    }
  };

  return (
    <div className="delivery-container">
      <div className="delivery-header">
        <div>
          <h1 className="delivery-title">Delivery Progress</h1>
          <p style={{ color: '#a1a1aa', margin: 0 }}>Live tracking of inbound materials.</p>
        </div>
        <div style={{ position: 'relative' }}>
          <Search size={18} color="#a1a1aa" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder="Track shipment..." 
            style={{ background: 'rgba(24,24,27,0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '0.75rem 1rem 0.75rem 2.5rem', color: '#fff', width: '250px' }}
          />
        </div>
      </div>

      <div className="delivery-grid">
        {deliveries.map(delivery => (
          <div key={delivery.id} className="delivery-card">
            <div className="delivery-card-header">
              <div>
                <h3 className="delivery-id">
                  <Truck size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
                  {delivery.id}
                </h3>
                <span className="delivery-vendor">{delivery.vendor} - {delivery.material}</span>
              </div>
              <span className={`delivery-status ${getStatusClass(delivery.status)}`}>{delivery.status}</span>
            </div>

            <div className="delivery-details">
              <div className="detail-block">
                <span className="detail-label">Origin</span>
                <span className="detail-value">{delivery.origin}</span>
              </div>
              <div className="detail-block" style={{ textAlign: 'right' }}>
                <span className="detail-label">Destination</span>
                <span className="detail-value">
                  <MapPin size={14} color="#EF4444" style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                  {delivery.destination}
                </span>
              </div>
            </div>

            <div className="progress-container">
              <div className="progress-header">
                <span>Progress: {delivery.progress}%</span>
                <span style={{ color: delivery.status === 'Delivered' ? '#10B981' : '#fff', fontWeight: 500 }}>ETA: {delivery.eta}</span>
              </div>
              <div className="progress-bar-bg">
                <div 
                  className="progress-bar-fill" 
                  style={{ width: `${delivery.progress}%`, background: delivery.color, boxShadow: `0 0 10px ${delivery.color}` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
