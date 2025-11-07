import { useState } from 'react';
import { forgotPassword } from '../services/api';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    console.log('ForgotPassword: handleSubmit called with email:', email);
    setLoading(true);
    setError('');
    try {
      console.log('ForgotPassword: calling forgotPassword API...');
      const result = await forgotPassword(email);
      console.log('ForgotPassword: API response:', result);
      setSent(true);
    } catch (err) {
      console.error('ForgotPassword: error occurred:', err);
      setError('Hubo un error. Intenta nuevamente.');
    } finally {
      setLoading(false);
      console.log('ForgotPassword: process completed');
    }
  };

  return (
    <div>
      <Header />
      <main className="centered-main">
        <form className="centered-form" onSubmit={handleSubmit}>
          <h2>Recuperar contraseña</h2>
          {sent ? (
            <div style={{ marginBottom: 10 }}>
              Si el correo existe, recibirás un enlace para restablecer tu contraseña.
            </div>
          ) : (
            <>
              <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="login-btn-full" disabled={loading}>
                Enviar enlace
              </button>
              <button
                type="button"
                className="register-btn"
                onClick={() => navigate('/login')}
              >
                Volver al login
              </button>
              {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}
            </>
          )}
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default ForgotPassword;