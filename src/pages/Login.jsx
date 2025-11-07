import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';


const Login = () => {
  const navigate = useNavigate();
  const { refreshAuth } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Error de autenticación');
        setLoading(false);
        return;
      }
      // Guardo el access token y usuario en localStorage
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      refreshAuth();
      // breve delay antes de redirigir
      setTimeout(() => {
        const redirectTo = localStorage.getItem('loginRedirect') || '/';
        localStorage.removeItem('loginRedirect');
        navigate(redirectTo);
      }, 120);
    } catch (err) {
      setError('Error de red o servidor');
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <main className="login-main">
        <section className="login-section">
          <div className="login-left">
            <div className="login-logo">CarwashFreaks</div>
          </div>
          <div className="login-right">
            <form className="login-form" onSubmit={handleSubmit}>
              <h2>Iniciar sesión</h2>
              {error && <div style={{ color: 'red', marginBottom: 10, textAlign: 'center' }}>Usuario o contraseña incorrectos</div>}
              <input 
                type="email" 
                name="email" 
                placeholder="Correo electrónico" 
                required 
                value={form.email} 
                onChange={handleChange}
                autoComplete="email"
              />
              <input 
                type="password" 
                name="password" 
                placeholder="Contraseña" 
                required 
                value={form.password} 
                onChange={handleChange}
                autoComplete="current-password"
              />
              <button type="submit" className="login-btn-full" disabled={loading}>Iniciar sesión</button>
              <button type="button" className="register-btn" onClick={() => navigate('/register')}>Registrarse</button>
              <button
                type="button"
                className="link-button"
                onClick={() => navigate('/forgot-password')}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
