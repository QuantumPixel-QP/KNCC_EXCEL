import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [organization, setOrganization] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      fetch('http://localhost:8000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        if (!res.ok) throw new Error('Invalid token');
        return res.json();
      })
      .then(data => {
        setUser(data.user);
        setOrganization(data.organization);
      })
      .catch(() => {
        setToken(null);
        localStorage.removeItem('token');
      })
      .finally(() => setLoading(false));
    } else {
      localStorage.removeItem('token');
      setUser(null);
      setOrganization(null);
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password) => {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);
    const res = await fetch('http://localhost:8000/api/auth/login', {
      method: 'POST',
      body: formData
    });
    if (!res.ok) throw new Error('Login failed');
    const data = await res.json();
    setToken(data.access_token);
  };

  const register = async (name, email, password, organization_name) => {
    const res = await fetch('http://localhost:8000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, organization_name })
    });
    if (!res.ok) throw new Error('Registration failed');
    const data = await res.json();
    setToken(data.access_token);
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
