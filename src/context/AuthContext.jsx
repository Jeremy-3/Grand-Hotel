import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/auth';
import Swal from 'sweetalert2';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleForceLogout = () => {
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    };

    window.addEventListener('auth-logout', handleForceLogout);
    return () => window.removeEventListener('auth-logout', handleForceLogout);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await authApi.login(email, password);
      const { access_token, user: userData } = response.data;

      setToken(access_token);
      setUser(userData);

      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(userData));

      Swal.fire({
        title: 'Welcome Back!',
        text: `Signed in as ${userData.name}`,
        icon: 'success',
        timer: 1800,
        showConfirmButton: false,
        background: '#0f172a',
        color: '#f8fafc',
        customClass: {
          popup: 'border border-gold-500/30 rounded-2xl shadow-luxury',
        },
      });

      return { success: true, user: userData };
    } catch (error) {
      Swal.fire({
        title: 'Login Failed',
        text: error.message || 'Invalid email or password',
        icon: 'error',
        background: '#0f172a',
        color: '#f8fafc',
        confirmButtonColor: '#cfa64b',
      });
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (formData) => {
    setLoading(true);
    try {
      const response = await authApi.signup(formData);
      Swal.fire({
        title: 'Registration Successful!',
        text: 'Your account has been created. Please log in with your credentials.',
        icon: 'success',
        background: '#0f172a',
        color: '#f8fafc',
        confirmButtonColor: '#cfa64b',
      });
      return { success: true, data: response.data };
    } catch (error) {
      Swal.fire({
        title: 'Registration Failed',
        text: error.message || 'Could not create account',
        icon: 'error',
        background: '#0f172a',
        color: '#f8fafc',
        confirmButtonColor: '#cfa64b',
      });
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (e) {
      // ignore
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      Swal.fire({
        title: 'Logged Out',
        text: 'You have been safely signed out.',
        icon: 'info',
        timer: 1500,
        showConfirmButton: false,
        background: '#0f172a',
        color: '#f8fafc',
      });
    }
  };

  const roleName = (user?.role || '').toUpperCase();
  const roleId = Number(user?.role_id);

  const isSuperAdmin = roleId === 1 || roleName === 'SUPERADMIN';
  const isManager = roleId === 2 || roleName === 'MANAGER' || isSuperAdmin;
  const isStaff = roleId === 3 || roleName === 'STAFF' || isManager;
  const isGuest = roleId === 4 || roleName === 'GUEST' || (!isManager && !isStaff && !isSuperAdmin);

  const value = {
    user,
    token,
    loading,
    isAuthenticated: Boolean(token && user),
    role: roleName || 'GUEST',
    isSuperAdmin,
    isManager,
    isStaff,
    isGuest,
    isStaffOrManager: isStaff || isManager || isSuperAdmin,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
