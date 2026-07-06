import React, { createContext, useContext, useState, useEffect } from 'react';
import { axiosClient, setLogoutCallback } from '../../service/GlobalApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkSession = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get(`/auth/me`);
      setUser(response.data.user);
    } catch (error) {
      setUser((prev) => {
        // Prevent race condition: if login() successfully set the user 
        // while this initial checkSession request was in flight, don't wipe it out.
        return prev ? prev : null;
      });
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
    const response = await axiosClient.post(`/auth/login`, { email, password });
    setUser(response.data.user);
    return response.data;
  };

  const signup = async (firstName, lastName, email, password) => {
    const response = await axiosClient.post(`/auth/signup`, { firstName, lastName, email, password });
    setUser(response.data.user);
    return response.data;
  };

  const logout = async () => {
    try {
      await axiosClient.post(`/auth/logout`, {});
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
    }
  };

  const googleLogin = async (credential) => {
    const response = await axiosClient.post(`/auth/google`, { credential });
    setUser(response.data.user);
    return response.data;
  };

  const demoLogin = async () => {
    const response = await axiosClient.post(`/auth/demo-login`, {});
    setUser(response.data.user);
    return response.data;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, googleLogin, demoLogin, checkSession }}>
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
