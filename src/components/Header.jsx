import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate, useLocation } from 'react-router-dom';

// Navegación pública (siempre visible)
const publicNavItems = [
  { label: 'Inicio', scrollTo: 'hero', isScroll: true },
  { label: 'Servicios', scrollTo: 'servicios', isScroll: true },
  { label: 'Contacto', scrollTo: 'contacto', isScroll: true },
];

// Navegación para usuarios NO autenticados
const guestNavItems = [
  { label: 'Login', to: '/login', isScroll: false },
  { label: 'Registrarse', to: '/register', isScroll: false },
];

// Navegación para usuarios autenticados
const authNavItems = [
  { label: 'Turnos', to: '/dashboard', isScroll: false },
];

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutMsg, setLogoutMsg] = useState('');
  const [showLogoutOverlay, setShowLogoutOverlay] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  // Función para determinar si el usuario es admin
  const isAdmin = () => {
    return user && user.role === 'admin';
  };

  const handleLogout = async () => {
    setShowLogoutOverlay(true);
    logout();
    setLogoutMsg('Sesión cerrada correctamente');
    setTimeout(() => {
      setLogoutMsg('');
      setShowLogoutOverlay(false);
      navigate('/');
    }, 1200);
  };

  // Obtener items de navegación según estado de autenticación y rol
  const getNavItems = () => {
    const items = [...publicNavItems];
    if (isAuthenticated) {
      items.push(...authNavItems);
      // Si es admin, agregar Panel de Admin
      if (isAdmin()) {
        items.push({ label: 'Panel Admin', to: '/admin', isScroll: false });
      }
    } else {
      items.push(...guestNavItems);
    }
    return items;
  };

  // Función para scroll suave a secciones
  const scrollToSection = (sectionId) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleNavClick = (item, e) => {
    e.preventDefault();
    setMenuOpen(false);
    
    if (item.isScroll) {
      scrollToSection(item.scrollTo);
    } else {
      navigate(item.to);
    }
  };

  const handleReservarClick = (e) => {
    e.preventDefault();
    setMenuOpen(false);

    if (!isAuthenticated) {
      localStorage.setItem('loginRedirect', '/user-appointments');
      navigate('/login');
    } else {
      navigate('/user-appointments');
    }
  };

  return (
    <>
      <header className="header">
        <div className="header-content">
          <Link to="/" className="logo">
            CarwashFreaks
            {isAdmin() && (
              <span className="admin-badge">ADMIN</span>
            )}
          </Link>

          <nav className="nav-links">
            {getNavItems().map(item => (
              <a 
                key={item.label} 
                href="#"
                className="nav-link"
                onClick={(e) => handleNavClick(item, e)}
              >
                {item.label}
              </a>
            ))}
            {!isAuthenticated && (
              <a href="#" className="nav-link reservar" onClick={handleReservarClick}>
                Reservar turno
              </a>
            )}
            {isAuthenticated && (
              <a href="#" className="nav-link" onClick={handleLogout}>
                Cerrar Sesión
              </a>
            )}
          </nav>

          <button
            className="hamburger"
            aria-label="Menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span style={{ fontSize: 28, color: '#222' }}>&#9776;</span>
          </button>
        </div>

        {menuOpen && (
          <nav className="mobile-menu">
            {getNavItems().map(item => (
              <a 
                key={item.label} 
                href="#"
                className="nav-link"
                onClick={(e) => handleNavClick(item, e)}
              >
                {item.label}
              </a>
            ))}
            {!isAuthenticated && (
              <a href="#" className="nav-link reservar" onClick={handleReservarClick}>
                Reservar turno
              </a>
            )}
            {isAuthenticated && (
              <a href="#" className="nav-link" onClick={handleLogout}>
                Cerrar Sesión
              </a>
            )}
          </nav>
        )}
      </header>
      {showLogoutOverlay && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.45)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            background: '#222',
            borderRadius: 16,
            boxShadow: '0 4px 24px rgba(0,0,0,0.25)',
            padding: '40px 32px',
            minWidth: 320,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            opacity: 0.98,
          }}>
            <div style={{ color: '#fff', fontSize: 26, fontWeight: 'bold', marginBottom: 24 }}>
              {logoutMsg || 'Cerrando sesión...'}
            </div>
            <div style={{ width: 60, height: 60, border: '6px solid #fff', borderTop: '6px solid #00bcd4', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
