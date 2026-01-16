'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/authStore';

import { UseAuthReturn, ApiResponse, User,  } from '@/types';

const useAuth = (): UseAuthReturn => {
  const router = useRouter();
  const { user, token, isAuthenticated, setAuth, logout: logoutStore, updateUser } = useAuthStore();

  // Login function
  const login = useCallback(async (email: string, password: string): Promise<ApiResponse<User>> => {
    try {
      // Mock login - JSONPlaceholder doesn't have auth
      // In production: const response = await api.post('/auth/login', { email, password });
      
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful login
      const mockUser: User = {
        id: 1,
        name: email.split('@')[0],
        email: email,
        username: email.split('@')[0],
      };
      
      const mockToken = 'mock-jwt-token-' + Date.now();
      
      setAuth(mockUser, mockToken);
      router.push('/dashboard');
      
      return { success: true, data: mockUser };
    } catch (error: any) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  }, [setAuth, router]);

  // Register function
  const register = useCallback(async (
    name: string, 
    email: string, 
    password: string
  ): Promise<ApiResponse<User>> => {
    try {
      // Mock registration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: Date.now(),
        name: name,
        email: email,
        username: name.toLowerCase().replace(/\s+/g, ''),
      };
      
      const mockToken = 'mock-jwt-token-' + Date.now();
      
      setAuth(mockUser, mockToken);
      router.push('/dashboard');
      
      return { success: true, data: mockUser };
    } catch (error: any) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      };
    }
  }, [setAuth, router]);

  // Logout function
  const logout = useCallback(() => {
    logoutStore();
    router.push('/login');
  }, [logoutStore, router]);

  // Check if user is authenticated
  const checkAuth = useCallback((): boolean => {
    return isAuthenticated && !!token;
  }, [isAuthenticated, token]);

  return {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout,
    checkAuth,
    updateUser,
  };
};

export default useAuth;

