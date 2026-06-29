import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [organization, setOrganization] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  const API_BASE = import.meta.env.VITE_API_URL || '/api';

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      const savedUser = JSON.parse(localStorage.getItem('user'));
      if (savedUser) {
        setUser(savedUser);
        setOrganization({ name: savedUser.organization_name || 'KNCC Demo Org' });
      }
      setLoading(false);
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setOrganization(null);
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password) => {
    let savedUser = JSON.parse(localStorage.getItem('user'));
    
    // If they are logging in as a demo account, but the saved user is different, override it
    if (email === 'admin@kncc.com' || email === 'engineer@kncc.com') {
      savedUser = null; 
    }
    
    if (email === 'admin@kncc.com' || email === 'engineer@kncc.com' || (savedUser && savedUser.email === email)) {
      const mockUser = savedUser || {
        email,
        name: email === 'admin@kncc.com' ? 'Demo Admin' : 'Demo Engineer',
        role: email === 'admin@kncc.com' ? 'admin' : 'member',
        organization_name: 'KNCC Demo Org'
      };
      
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      setOrganization({ name: mockUser.organization_name || 'KNCC Demo Org' });
      setToken('mock-jwt-token-12345');
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const register = async (name, email, password, organization_name) => {
    const newUser = { name, email, role: 'admin', organization_name };
    localStorage.setItem('user', JSON.stringify(newUser));
    setUser(newUser);
    setOrganization({ name: organization_name });
    setToken('mock-jwt-token-12345');
  };

  const logout = () => {
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, organization, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
