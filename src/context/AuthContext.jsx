import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

const defaultProfile = {
  name: 'Admin User',
  email: 'admin@wildnest.com',
  phone: '+91 98765 43210',
  bio: 'WildNest Adventures administrator.',
  location: 'Rishikesh, Uttarakhand',
  role: 'Super Admin',
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('adminLoggedIn') === 'true');
  const [profile, setProfile] = useState(() => {
    try { return JSON.parse(localStorage.getItem('adminProfile')) || defaultProfile; }
    catch { return defaultProfile; }
  });

  const login = () => { localStorage.setItem('adminLoggedIn', 'true'); setIsLoggedIn(true); };

  const logout = () => { localStorage.removeItem('adminLoggedIn'); setIsLoggedIn(false); };

  const updateProfile = (data) => {
    const updated = { ...profile, ...data };
    localStorage.setItem('adminProfile', JSON.stringify(updated));
    setProfile(updated);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, profile, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
