import { useState, useEffect } from 'react';

// Custom hook para autenticación centralizada
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
  
  // Permite refrescar el estado manualmente (ej: tras login/logout)
  const refreshAuth = () => {
    const token = localStorage.getItem('accessToken');
    const userData = localStorage.getItem('user');
    setIsAuthenticated(!!token);
    setUser(userData ? JSON.parse(userData) : null);
  };

  // Permite cerrar sesión limpiando localStorage y refrescando estado
  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  return { isAuthenticated, user, refreshAuth, logout };
}
