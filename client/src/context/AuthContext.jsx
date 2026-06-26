import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { setLogoutCallback } from '../../service/GlobalApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_BACKEND_URL + '/api/auth';

  const checkSession = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/me`, { withCredentials: true });
      setUser(response.data.user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  // Register logout callback so the GlobalApi 401 interceptor can clear user state
  useEffect(() => {
    setLogoutCallback(() => setUser(null));
    return () => setLogoutCallback(null);
  }, []);

  const login = async (email, password) => {
    const response = await axios.post(`${API_URL}/login`, { email, password }, { withCredentials: true });
    setUser(response.data.user);
    return response.data;
  };

  const signup = async (firstName, lastName, email, password) => {
    const response = await axios.post(`${API_URL}/signup`, { firstName, lastName, email, password }, { withCredentials: true });
    setUser(response.data.user);
    return response.data;
  };

  const logout = async () => {
    try {
      await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
    }
  };

  const googleLogin = async (credential) => {
    const response = await axios.post(`${API_URL}/google`, { credential }, { withCredentials: true });
    setUser(response.data.user);
    return response.data;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, googleLogin, checkSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
