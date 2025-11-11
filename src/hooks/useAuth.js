// Custom hook for centralized authentication management
import { useState, useEffect } from 'react';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('accessToken'));
  const [user, setUser] = useState(() => {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  });

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const userData = localStorage.getItem('user');
    setIsAuthenticated(!!token);
    setUser(userData ? JSON.parse(userData) : null);
  }, []);
  
  // Allows manual state refresh (e.g., after login/logout)
  const refreshAuth = () => {
    const token = localStorage.getItem('accessToken');
    const userData = localStorage.getItem('user');
    setIsAuthenticated(!!token);
    setUser(userData ? JSON.parse(userData) : null);
  };

  // Logs out by clearing localStorage and refreshing state
  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  return { isAuthenticated, user, refreshAuth, logout };
}
