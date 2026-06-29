import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlatform } from '../context/PlatformContext';
import './ProjectOnboarding.css';

export default function ProjectOnboarding() {
  const navigate = useNavigate();
  const { createProject } = usePlatform();
  
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    budget: '',
    client: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createProject(formData);
    navigate('/dashboard'); // Go to dashboard immediately after creation
  };

  return (
    <div className="onboarding-container">
      <div className="onboarding-card">
        <h1 className="onboarding-title">Create New Project</h1>
        <p className="onboarding-subtitle">Set up your construction project to begin tracking materials, purchase orders, and documents.</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Project Name</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. Downtown Highrise Phase 2" 
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Location / Site Name</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. 123 Main St, Zone A" 
              required
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Client / Owner Name</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. Acme Development Corp" 
              required
              value={formData.client}
              onChange={(e) => setFormData({...formData, client: e.target.value})}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Estimated Budget (USD)</label>
            <input 
              type="number" 
              className="form-input" 
              placeholder="e.g. 5000000" 
              required
              value={formData.budget}
              onChange={(e) => setFormData({...formData, budget: e.target.value})}
            />
          </div>

          <button type="submit" className="submit-btn">Initialize Project Workspace</button>
        </form>
      </div>
    </div>
  );
}
