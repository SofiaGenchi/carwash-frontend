import emailjs from 'emailjs-com';

// Configuración de EmailJS (reemplaza con tus datos reales)
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const USER_ID = import.meta.env.VITE_EMAILJS_USER_ID;

/**
 * Envía el email de recuperación de contraseña al usuario.
 * @param {Object} params - { email, name, token }
 * @returns {Promise}
 */
export async function sendRecoveryEmail({ email, name, link }) {
	// Validación básica de inputs
	if (!email || !name || !link) throw new Error('Datos insuficientes para enviar el email');
	if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new Error('Email inválido');

	// Datos para el template de EmailJS
	const templateParams = {
		to_email: email,   // Para {{to_email}}
		to_name: name,     // Para {{to_name}}
		link               // Para {{link}}
	};

		// Logs de depuración (solo parámetros, no credenciales)
		console.log('[EmailJS] templateParams:', templateParams);

	try {
		const response = await emailjs.send(
			SERVICE_ID,
			TEMPLATE_ID,
			templateParams,
			USER_ID
		);
		console.log('[EmailJS] response:', response);
		return response;
	} catch (error) {
		console.error('[EmailJS] error:', error);
		throw new Error('Error al enviar el email de recuperación');
	}
}
