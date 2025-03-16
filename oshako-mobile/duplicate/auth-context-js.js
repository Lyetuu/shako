import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login, logout, refreshToken, getUserProfile } from '../services/api/auth';

// Create context
const AuthContext = createContext(null);

// Storage keys
const TOKEN_KEY = '@app_token';
const USER_KEY = '@app_user';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load stored authentication data on app start
  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        const [storedToken, storedUser] = await Promise.all([
          AsyncStorage.getItem(TOKEN_KEY),
          AsyncStorage.getItem(USER_KEY)
        ]);

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (e) {
        console.error('Failed to load auth data', e);
      } finally {
        setLoading(false);
      }
    };

    loadStoredAuth();
  }, []);

  // Handle user login
  const handleLogin = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const { token: newToken, user: userData } = await login(email, password);
      
      // Store authentication data
      await Promise.all([
        AsyncStorage.setItem(TOKEN_KEY, newToken),
        AsyncStorage.setItem(USER_KEY, JSON.stringify(userData))
      ]);
      
      setToken(newToken);
      setUser(userData);
      
      return { success: true };
    } catch (error) {
      setError(error.message || 'Login failed');
      return { success: false, error: error.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  // Handle user logout
  const handleLogout = async () => {
    try {
      setLoading(true);
      
      // Call logout API if needed
      if (token) {
        await logout(token);
      }
      
      // Clear stored auth data
      await Promise.all([
        AsyncStorage.removeItem(TOKEN_KEY),
        AsyncStorage.removeItem(USER_KEY)
      ]);
      
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error('Logout error', error);
    } finally {
      setLoading(false);
    }
  };

  // Refresh user profile data
  const refreshUserProfile = async () => {
    if (!token) return;
    
    try {
      const userData = await getUserProfile();
      setUser(userData);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));
    } catch (error) {
      console.error('Failed to refresh user profile', error);
    }
  };

  // Check if user is authenticated
  const isAuthenticated = !!token && !!user;

  // Check if user is an admin of specified group
  const isGroupAdmin = (groupId) => {
    if (!user || !user.groups) return false;
    
    const group = user.groups.find(g => g._id === groupId);
    return group ? group.isAdmin : false;
  };

  // Value to be provided by context
  const value = {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    login: handleLogin,
    logout: handleLogout,
    refreshProfile: refreshUserProfile,
    isGroupAdmin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
