import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">KNCC</h1>
          <p className="auth-subtitle">Sign in to your organization</p>
        </div>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email address</label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
              placeholder="engineer@kncc.com"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="auth-button">Sign In</button>
        </form>
        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
          <div style={{ fontSize: '0.8rem', color: '#a1a1aa', textAlign: 'center', marginBottom: '0.2rem' }}>Demo Accounts</div>
          <button 
            type="button" 
            onClick={() => { setEmail('admin@kncc.com'); setPassword('password123'); }}
            style={{ padding: '0.75rem', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)', color: '#F59E0B', borderRadius: '6px', cursor: 'pointer', fontFamily: 'Inter', fontSize: '0.9rem', fontWeight: 500, transition: 'all 0.2s' }}
            onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(245, 158, 11, 0.2)' }}
            onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(245, 158, 11, 0.1)' }}
          >
            Load Admin Credentials
          </button>
          <button 
            type="button" 
            onClick={() => { setEmail('engineer@kncc.com'); setPassword('password123'); }}
            style={{ padding: '0.75rem', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', color: '#3B82F6', borderRadius: '6px', cursor: 'pointer', fontFamily: 'Inter', fontSize: '0.9rem', fontWeight: 500, transition: 'all 0.2s' }}
            onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)' }}
            onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)' }}
          >
            Load Engineer Credentials
          </button>
        </div>
        <div className="auth-footer">
          Don't have an account? <Link to="/register">Request access</Link>
        </div>
      </div>
    </div>
  );
}
