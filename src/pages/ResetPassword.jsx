// Page for resetting user passwords
import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { resetPassword } from '../services/api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../index.css';

const ResetPassword = () => {
  const [params] = useSearchParams();
  const token = params.get('token');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    console.log('ResetPassword - Submitting with token:', token, 'password length:', password.length);
    try {
      console.log('ResetPassword - Calling resetPassword');
      const res = await resetPassword(token, password);
      console.log('ResetPassword - resetPassword response:', res);
      console.log('ResetPassword - Setting done to true');
      setDone(true);
      // Removed automatic redirect
    } catch (err) {
      console.error('ResetPassword - Error:', err);
      setError('Error al restablecer la contraseña.');
    }
  };

  if (!token) return <div>Token inválido.</div>;

  return (
    <div>
      <Header />
      <main className="centered-main">
        {done ? (
          <div className="centered-form">
            <h2>Contraseña actualizada correctamente</h2>
            <p>
              <a href="/login">Haz click aquí para iniciar sesión</a>
            </p>
          </div>
        ) : (
          <form className="centered-form" onSubmit={handleSubmit}>
            <h2>Restablecer contraseña</h2>
            <input
              type="password"
              placeholder="Nueva contraseña"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
            />
            <button type="submit" className="login-btn-full">
              Restablecer
            </button>
          </form>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ResetPassword;