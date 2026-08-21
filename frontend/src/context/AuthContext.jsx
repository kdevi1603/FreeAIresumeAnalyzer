import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api.js';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const profile = await authService.getMe();
          if (profile.role === 'admin' || profile.role === 'super_admin') {
            setUser(null);
            localStorage.removeItem('user');
          } else {
            setUser(profile);
            localStorage.setItem('user', JSON.stringify(profile));
          }
        } catch (err) {
          console.error('Session expired or invalid:', err);
          authService.logout();
          setUser(null);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const data = await authService.login({ email, password });
      if (data.role === 'admin' || data.role === 'super_admin') {
        throw new Error('Admin accounts must log in via the /admin portal.');
      }
      setUser(data);
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to sign in. Please check your credentials.';
      setError(msg);
      throw new Error(msg);
    }
  };

  const googleLogin = async (idToken) => {
    setError(null);
    try {
      const data = await authService.googleLogin(idToken);
      setUser(data);
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to sign in with Google.';
      setError(msg);
      throw new Error(msg);
    }
  };

  const register = async (name, email, password) => {
    setError(null);
    try {
      const data = await authService.register({ name, email, password });
      setUser(data);
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to register account.';
      setError(msg);
      throw new Error(msg);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    googleLogin,
    register,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
