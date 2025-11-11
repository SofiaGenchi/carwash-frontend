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
      console.log('ForgotPassword - Calling forgotPassword with email:', email);
      const result = await forgotPassword(email);
      console.log('ForgotPassword - forgotPassword result:', result);
      if (result && result.token && result.name && result.email) {
        const link = `${window.location.origin}/reset-password?token=${result.token}`;
        console.log('ForgotPassword - Sending recovery email to:', result.email, 'with link:', link);
        await sendRecoveryEmail({
          email: result.email,
          name: result.name,
          link
        });
        console.log('ForgotPassword - Recovery email sent successfully');
        setSent(true);
      } else {
        console.error('ForgotPassword - Invalid result from forgotPassword:', result);
        setError('No se pudo obtener los datos para el email.');
      }
    } catch (err) {
      console.error('ForgotPassword - Error in handleSubmit:', err);
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
              Hemos enviado un correo electrónico con las instrucciones para restablecer tu contraseña.
            </div>
          ) : (
            <>
              <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <button type="submit" className="login-btn-full" disabled={loading}>
                {loading ? 'Enviando...' : 'Enviar'}
              </button>
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