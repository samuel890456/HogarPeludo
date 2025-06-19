const express = require('express');
const router = express.Router();
const enviarCorreo = require('../utils/correoUtils');

router.get('/correo-prueba', async (req, res) => {
  try {
    await enviarCorreo({
      to: 'zeaestiven654@gmail.com', // <-- Cambia esto a tu correo real
      subject: '🎉 Prueba de envío de correo',
      html: '<h1>¡Funciona!</h1><p>Este correo fue enviado desde SendGrid con Node.js.</p>',
    });
    res.send('✅ Correo de prueba enviado correctamente');
  } catch (err) {
    res.status(500).send('❌ Error al enviar el correo: ' + err.message);
  }
});

module.exports = router;
