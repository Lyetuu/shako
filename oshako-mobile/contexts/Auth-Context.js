import React, { createContext, useState, useContext, useEffect } from 'react';
import { Alert } from 'react-native';
import supabase from '../config/supabase';
import { getCurrentUser, loginUser, logoutUser, registerUser } from '../services/api/auth';

// Create the authentication context
const AuthContext = createContext({});

// Custom hook for using the auth context
export const useAuth = () => useContext(AuthContext);

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Handle session changes
  useEffect(() => {
    setLoading(true);
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchUser();
      } else {
        setLoading(false);
      }
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log(`Supabase auth event: ${event}`);
        setSession(session);
        
        if (session) {
          await fetchUser();
        } else {
          setUser(null);
          setLoading(false);
        }
      }
    );

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch user data from profiles table
  const fetchUser = async () => {
    try {
      setLoading(true);
      const userData = await getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setAuthError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Sign up handler
  const signUp = async (email, password, userData) => {
    try {
      setLoading(true);
      setAuthError(null);
      
      const result = await registerUser(email, password, userData);
      
      Alert.alert(
        'Registration Successful',
        'Please check your email for confirmation.',
        [{ text: 'OK' }]
      );
      
      return result;
    } catch (error) {
      console.error('Sign up error:', error);
      setAuthError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign in handler
  const signIn = async (email, password) => {
    try {
      setLoading(true);
      setAuthError(null);
      
      const { session } = await loginUser(email, password);
      return session;
    } catch (error) {
      console.error('Sign in error:', error);
      setAuthError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign out handler
  const signOut = async () => {
    try {
      setLoading(true);
      await logoutUser();
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
      setAuthError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Reset error state
  const resetError = () => {
    setAuthError(null);
  };

  // Context value
  const value = {
    user,
    session,
    loading,
    error: authError,
    signUp,
    signIn,
    signOut,
    resetError,
    refreshUser: fetchUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};