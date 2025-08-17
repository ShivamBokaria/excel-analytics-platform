import { createContext, useContext, useState, useEffect } from 'react';
import API from '../utils/axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const { data } = await API.get('/auth/me');
        setUser(data);
        setIsAuthenticated(true);
      }
    } catch (error) {
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const persistAccount = (userObj, token) => {
    try {
      const existing = JSON.parse(localStorage.getItem('recentAccounts') || '[]');
      const withoutDup = existing.filter(acc => acc.email !== userObj.email);
      const updated = [{
        id: userObj.id,
        name: userObj.name,
        email: userObj.email,
        role: userObj.role,
        lastUsedAt: new Date().toISOString(),
      }, ...withoutDup].slice(0, 5);
      localStorage.setItem('recentAccounts', JSON.stringify(updated));
      const tokensByEmail = JSON.parse(localStorage.getItem('tokensByEmail') || '{}');
      tokensByEmail[userObj.email] = token;
      localStorage.setItem('tokensByEmail', JSON.stringify(tokensByEmail));
    } catch {}
  };

  const login = async (email, password, role = 'user') => {
    try {
      const { data } = await API.post('/auth/login', { email, password, role });
      localStorage.setItem('token', data.token);
      setUser(data.user);
      setIsAuthenticated(true);
      persistAccount(data.user, data.token);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const switchToAccount = async (email) => {
    try {
      const tokensByEmail = JSON.parse(localStorage.getItem('tokensByEmail') || '{}');
      const token = tokensByEmail[email];
      if (!token) return { success: false, message: 'No saved session for this account' };
      localStorage.setItem('token', token);
      const { data } = await API.get('/auth/me');
      setUser(data);
      setIsAuthenticated(true);
      // refresh lastUsedAt
      persistAccount({ id: data._id || data.id, name: data.name, email: data.email, role: data.role }, token);
      return { success: true };
    } catch (e) {
      return { success: false, message: 'Saved session expired. Please log in again.' };
    }
  };

  const googleSignIn = async (googleToken) => {
    try {
      const { data } = await API.post('/auth/google', { token: googleToken });
      localStorage.setItem('token', data.token);
      setUser(data.user);
      setIsAuthenticated(true);
      persistAccount(data.user, data.token);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Google sign-in failed' 
      };
    }
  };

  const appleSignIn = async (appleToken) => {
    try {
      const { data } = await API.post('/auth/apple', { token: appleToken });
      localStorage.setItem('token', data.token);
      setUser(data.user);
      setIsAuthenticated(true);
      persistAccount(data.user, data.token);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Apple sign-in failed' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const { data } = await API.post('/auth/register', userData);
      return { 
        success: true, 
        message: data.message,
        requiresApproval: data.requiresApproval 
      };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    switchToAccount,
    googleSignIn,
    appleSignIn,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};