const express = require('express');
const cors = require('cors');
const pool = require('./config/database');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/incidentes', require('./routes/incidentes'));
app.use('/api/contratos', require('./routes/contratos'));

// Ruta de salud
app.get('/api/health', async (req, res) => {
  try {
    // Probar conexión a la base de datos
    await pool.query('SELECT 1');
    res.json({
      status: 'OK',
      message: 'Servidor funcionando correctamente',
      database: process.env.DB_NAME || 'Gobierno1'
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: 'Error de conexión a la base de datos',
      error: error.message
    });
  }
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en el puerto ${PORT}`);
  console.log(`📊 Base de datos: ${process.env.DB_NAME || 'Gobierno1'}`);
});

