// Header component with navigation and authentication handling
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../index.css';

// Public navigation items (always visible)
const publicNavItems = [
  { label: 'Inicio', scrollTo: 'hero', isScroll: true },
  { label: 'Servicios', scrollTo: 'servicios', isScroll: true },
  { label: 'Turnos', to: '/dashboard', isScroll: false },
  { label: 'Contacto', scrollTo: 'contacto', isScroll: true },
];

// Navigation for unauthenticated users
const guestNavItems = [
  { label: 'Login', to: '/login', isScroll: false },
  { label: 'Registrarse', to: '/register', isScroll: false },
];

// Navigation for authenticated users
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

  // Function to determine if the user is an admin
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

  // Get navigation items based on authentication state and role
  const getNavItems = () => {
    const items = [...publicNavItems];
    if (isAuthenticated) {
      items.push(...authNavItems);
      // If admin, add Admin Panel
      if (isAdmin()) {
        items.push({ label: 'Panel Admin', to: '/admin', isScroll: false });
      }
    } else {
      items.push(...guestNavItems);
    }
    return items;
  };

  // Smooth scroll function to sections
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
      <header>
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
        <div className="logout-overlay">
          <div className="logout-content">
            <div className="logout-message">
              {logoutMsg || 'Cerrando sesión...'}
            </div>
            <div className="logout-spinner" />
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
