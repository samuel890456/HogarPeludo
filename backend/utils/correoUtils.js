//backend/utils/correoUtils.js
const sgMail = require('@sendgrid/mail');
require('dotenv').config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = async function enviarCorreo({ to, subject, html }) {
  const msg = {
    to,
    from: process.env.CORREO_ORIGEN,
    subject,
    html,
  };

  try {
    await sgMail.send(msg);
    console.log('📧 Correo enviado a:', to);
  } catch (error) {
    console.error('❌ Error al enviar el correo:', error.response?.body || error.message);
  }
};
