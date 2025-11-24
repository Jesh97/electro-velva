const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Login
router.post('/login', async (req, res) => {
  try {
    const { correo, contrasena } = req.body;

    if (!correo || !contrasena) {
      return res.status(400).json({ error: 'Correo y contraseña son requeridos' });
    }

    // Buscar usuario con su rol y área
    const query = `
      SELECT 
        u.id_usuario,
        u.nombre,
        u.ape_pat,
        u.ape_mat,
        u.correo,
        u.contrasena,
        u.estado,
        r.id_rol,
        r.tipo as tipo_rol,
        r.nombre as nombre_rol,
        a.id_area,
        a.nombre as nombre_area
      FROM usuario u
      INNER JOIN rol r ON u.id_rol = r.id_rol
      INNER JOIN area a ON r.id_area = a.id_area
      WHERE u.correo = $1 AND u.estado = true
    `;

    const result = await pool.query(query, [correo]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const user = result.rows[0];

    // Verificar contraseña
    const validPassword = await bcrypt.compare(contrasena, user.contrasena);

    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Generar token JWT
    const token = jwt.sign(
      {
        id_usuario: user.id_usuario,
        correo: user.correo,
        tipo_rol: user.tipo_rol,
        id_area: user.id_area
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Retornar usuario sin contraseña
    const usuario = {
      id_usuario: user.id_usuario,
      nombre: user.nombre,
      ape_pat: user.ape_pat,
      ape_mat: user.ape_mat,
      correo: user.correo,
      tipo_rol: user.tipo_rol,
      nombre_rol: user.nombre_rol,
      id_area: user.id_area,
      nombre_area: user.nombre_area
    };

    res.json({
      token,
      usuario
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Verificar token
router.get('/verify', async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ valid: true, user: decoded });
  } catch (error) {
    res.status(403).json({ error: 'Token inválido' });
  }
});

module.exports = router;

