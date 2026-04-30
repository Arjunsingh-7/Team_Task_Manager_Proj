import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
  });
  const [loading, setLoading] = useState(true);

  // Verify token on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { setLoading(false); return; }
    authAPI.me()
      .then(res => setUser(res.data.data || res.data))
      .catch(() => { localStorage.removeItem('token'); localStorage.removeItem('user'); })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const res = await authAPI.login({ email, password });
      console.log('Login response:', res.data);
      
      // Handle ApiResponse wrapper
      const responseData = res.data.data || res.data;
      const { token, id, name, email: userEmail } = responseData;
      const userData = { id, name, email: userEmail };
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      throw error;
    }
  }, []);

  const signup = useCallback(async (name, email, password) => {
    try {
      const res = await authAPI.signup({ name, email, password });
      console.log('Signup response:', res.data);
      
      // Handle ApiResponse wrapper
      const responseData = res.data.data || res.data;
      const { token, id, name: userName, email: userEmail } = responseData;
      const userData = { id, name: userName, email: userEmail };
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Signup error:', error.response?.data || error.message);
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  const isAdmin = (project) => {
    if (!project || !user) return false;
    // Check if user is admin of a project
    return project.adminId === user.id || user.role === 'ADMIN';
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
