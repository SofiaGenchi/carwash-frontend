import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="footer">
    <div className="footer-content">
      <div className="footer-left">
        <span className="footer-title">Enlaces útiles</span>
        <nav className="footer-links">
          <Link to="/">Inicio</Link>
          <Link to="/turnos">Turnos</Link>
          <Link to="/servicios">Servicios</Link>
          <Link to="/contacto">Contacto</Link>
        </nav>
      </div>
      <div className="footer-right">
        <span className="footer-title">Nuestras redes</span>
        <div className="footer-social">
          <a href="#" aria-label="Instagram" className="social-icon">Instagram</a>
          <a href="#" aria-label="Facebook" className="social-icon">Facebook</a>
          <a href="#" aria-label="WhatsApp" className="social-icon">WhatsApp</a>
        </div>
      </div>
    </div>
    <div className="footer-bottom">
      © {new Date().getFullYear()} CarwashFreaks. Todos los derechos reservados.
    </div>
  </footer>
);

export default Footer;
