// EmailJS configuration and recovery email service
import emailjs from 'emailjs-com';

// Configuración de EmailJS
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const USER_ID = import.meta.env.VITE_EMAILJS_USER_ID;

/**
 * Sends a password recovery email to the user.
 * @param {Object} params - { email, name, token }
 * @returns {Promise}
 */
export async function sendRecoveryEmail({ email, name, link }) {
	// Basic input validation
	if (!email || !name || !link) throw new Error('Datos insuficientes para enviar el email');
	if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new Error('Email inválido');

	// Data for the EmailJS template
	const templateParams = {
		to_email: email,   // For {{to_email}}
		to_name: name,     // For {{to_name}}
		link               // For {{link}}
	};

	// Debug logs
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
