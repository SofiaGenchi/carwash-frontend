import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { resetPassword } from '../services/api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Loader from '../components/Loader';

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
    try {
      const res = await resetPassword(token, password);
      if (res.message === 'Contraseña actualizada correctamente.') {
        setDone(true);
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(res.message || 'Error al restablecer la contraseña.');
      }
    } catch {
      setError('Error al restablecer la contraseña.');
    }
  };

  if (!token) return <div>Token inválido.</div>;

  return (
    <div>
      <Header />
      <main className="centered-main">
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
          <button
            type="button"
            className="register-btn"
            onClick={() => navigate('/login')}
          >
            Volver al login
          </button>
          {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}
          {done && <Loader text="Redirigiendo" />}
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default ResetPassword;