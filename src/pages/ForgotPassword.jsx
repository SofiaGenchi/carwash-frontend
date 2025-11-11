// Page for handling password recovery requests
import { useState } from 'react';
import { forgotPassword } from '../services/api';
import { sendRecoveryEmail } from '../services/emailService';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../index.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = await forgotPassword(email);
      if (result && result.token && result.name && result.email) {
        const link = `${window.location.origin}/reset-password?token=${result.token}`;
        await sendRecoveryEmail({
          email: result.email,
          name: result.name,
          link
        });
        setSent(true);
      } else {
        setError('No se pudo obtener los datos para el email.');
      }
    } catch (err) {
      setError('Hubo un error. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <main className="centered-main">
        <form className="centered-form" onSubmit={handleSubmit}>
          <h2>Recuperar contraseña</h2>
          {sent ? (
            <div className="forgot-password-message">
              Si el correo existe, recibirás un enlace para restablecer tu contraseña.
            </div>
          ) : (
            <>
              <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              {error && <div className="forgot-password-error">{error}</div>}
            </>
          )}
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default ForgotPassword;