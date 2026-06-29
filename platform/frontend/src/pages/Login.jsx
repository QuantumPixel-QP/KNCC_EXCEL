import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <img src={logo} alt="KNCC Logo" style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'contain' }} />
            <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.75rem', letterSpacing: '0.05em', color: '#fff' }}>KNCC EXCEL</span>
          </div>
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
        <div className="auth-footer">
          Don't have an account? <Link to="/register">Request access</Link>
        </div>
      </div>
    </div>
  );
}
