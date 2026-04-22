import { createContext, useContext, useState } from 'react';
import { loginApi, signupApi } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

const defaultProfile = {
  name: 'Admin User',
  email: 'admin@wildnest.com',
  phone: '',
  bio: '',
  location: '',
  role: 'admin',
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('adminToken'));
  const [profile, setProfile] = useState(() => {
    try { return JSON.parse(localStorage.getItem('adminProfile')) || defaultProfile; }
    catch { return defaultProfile; }
  });

  // ── Login ──────────────────────────────────────────────────
  const login = async (email, password) => {
    const res = await loginApi({ email, password });
    const { token, user } = res.data;
    localStorage.setItem('adminToken', token);
    localStorage.setItem('adminLoggedIn', 'true');
    const prof = { name: user.name, email: user.email, phone: user.phone || '', bio: '', location: '', role: user.role };
    localStorage.setItem('adminProfile', JSON.stringify(prof));
    setProfile(prof);
    setIsLoggedIn(true);
  };

  // ── Signup ─────────────────────────────────────────────────
  const signup = async (name, email, phone, password) => {
    const res = await signupApi({ name, email, phone, password });
    const { token, user } = res.data;
    localStorage.setItem('adminToken', token);
    localStorage.setItem('adminLoggedIn', 'true');
    const prof = { name: user.name, email: user.email, phone: user.phone || '', bio: '', location: '', role: user.role };
    localStorage.setItem('adminProfile', JSON.stringify(prof));
    setProfile(prof);
    setIsLoggedIn(true);
  };

  // ── Logout ─────────────────────────────────────────────────
  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminLoggedIn');
    setIsLoggedIn(false);
  };

  // ── Update profile locally (after PUT /profile) ────────────
  const updateProfile = (data) => {
    const updated = { ...profile, ...data };
    localStorage.setItem('adminProfile', JSON.stringify(updated));
    setProfile(updated);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, signup, logout, profile, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
