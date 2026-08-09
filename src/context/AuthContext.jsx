import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loginApi, registerApi, getCurrentUserApi, logoutApi } from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper to clear tokens from storage
  const clearStorage = () => {
    localStorage.removeItem('codex_token');
    localStorage.removeItem('codex_user');
    sessionStorage.removeItem('codex_token');
    sessionStorage.removeItem('codex_user');
  };

  // Logout method
  const logout = useCallback(async () => {
    try {
      await logoutApi();
    } catch (err) {
      console.warn('Logout API error:', err);
    } finally {
      clearStorage();
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
      setError(null);
    }
  }, []);

  // Initialize & restore session on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('codex_token') || sessionStorage.getItem('codex_token');
      const storedUser = localStorage.getItem('codex_user') || sessionStorage.getItem('codex_user');

      if (storedToken && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setToken(storedToken);
          setUser(parsedUser);
          setIsAuthenticated(true);
          
          // Optionally verify with server in background
          try {
            const data = await getCurrentUserApi();
            if (data && data.user) {
              setUser(data.user);
              const storage = localStorage.getItem('codex_token') ? localStorage : sessionStorage;
              storage.setItem('codex_user', JSON.stringify(data.user));
            }
          } catch {
            // Keep stored session if server check fails in dev/offline mode
          }
        } catch {
          clearStorage();
        }
      }
      setIsLoading(false);
    };

    initAuth();

    // Listen for unauthorized 401 response events triggered by Axios interceptor
    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener('codex:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('codex:unauthorized', handleUnauthorized);
    };
  }, [logout]);

  // Login handler
  const login = async (email, password, rememberMe = true) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await loginApi({ email, password });
      
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('codex_token', data.token);
      storage.setItem('codex_user', JSON.stringify(data.user));

      setToken(data.token);
      setUser(data.user);
      setIsAuthenticated(true);
      setIsLoading(false);
      return { success: true, message: data.message };
    } catch (err) {
      setIsLoading(false);
      const errorMessage = err.response?.data?.message || err.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Register handler
  const register = async (name, email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await registerApi({ name, email, password });

      // Automatically log user in upon registration
      localStorage.setItem('codex_token', data.token);
      localStorage.setItem('codex_user', JSON.stringify(data.user));

      setToken(data.token);
      setUser(data.user);
      setIsAuthenticated(true);
      setIsLoading(false);
      return { success: true, message: data.message };
    } catch (err) {
      setIsLoading(false);
      const errorMessage = err.response?.data?.message || err.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Clear error state helper
  const clearError = () => setError(null);

  const value = {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to consume AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
