import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import imgHero from '../../public/img/carwash-section.png';

const Register = () => {
  const navigate = useNavigate();
  const { refreshAuth } = useAuth();
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    password: ''
  });
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
      const res = await fetch('/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (!res.ok) {
      const data = await res.json();
      if (data.message === 'La contraseña debe tener al menos 6 caracteres.') {
        setError('La contraseña debe tener al menos 6 caracteres.');
      } else {
        setError(data.message || 'Error al registrar usuario');
      }
      setLoading(false);
      return;
    }
      navigate('/login');
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
              <h2>Registrarse</h2>
              <input type="text" name="nombre" placeholder="Nombre" required value={form.nombre} onChange={handleChange} />
              <input type="text" name="apellido" placeholder="Apellido" required value={form.apellido} onChange={handleChange} />
              <input type="email" name="email" placeholder="Correo electrónico" required value={form.email} onChange={handleChange} />
              <input type="tel" name="telefono" placeholder="Teléfono" required value={form.telefono} onChange={handleChange} />
              <input type="password" name="password" placeholder="Contraseña" required value={form.password} onChange={handleChange} />
              <button type="submit" className="login-btn-full" disabled={loading}>Registrarse</button>
              <button type="button" className="register-btn" onClick={() => navigate('/login')}>Iniciar sesión</button>
              {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Register;
