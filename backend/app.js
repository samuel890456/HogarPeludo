// file: backend/app.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Importa el paquete cors
const authRoutes = require('./routes/authRoutes');
const mascotasRoutes = require('./routes/mascotasRoutes');
const usuariosRoutes = require('./routes/usuariosRoutes');
const rolesRoutes = require('./routes/rolesRoutes');
const solicitudesRoutes = require('./routes/solicitudesRoutes');
const seguimientoRoutes = require('./routes/seguimientoRoutes');
const adopcionesRoutes = require('./routes/adopcionesRoutes');
const app = express();
const path = require('path');
const adminRoutes = require('./routes/adminRoutes');
const testCorreo = require('./routes/testCorreo');

// --- Configuración de CORS más explícita ---
const corsOptions = {
  origin: 'http://localhost:3000', // Reemplaza con el origen de tu frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Encabezados permitidos, crucial para Authorization
  credentials: true // Si vas a usar cookies o sesiones con credenciales
};

app.use(cors(corsOptions)); // Aplica la configuración de CORS

// --- Middlewares ---
app.use(bodyParser.json());

// --- Rutas ---
app.use('/api/test', testCorreo);
app.use('/api/adopciones', adopcionesRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/mascotas', mascotasRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/roles', rolesRoutes);
app.use('/api/solicitudes', solicitudesRoutes);
app.use('/api/seguimiento', seguimientoRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/admin', adminRoutes);

// --- Puerto del Servidor ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});