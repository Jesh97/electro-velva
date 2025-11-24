const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

// Obtener todos los contratos
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { estado } = req.query;
    const userId = req.user.id_usuario;

    let query = `
      SELECT 
        c.*,
        COUNT(CASE WHEN cfp.firmado = false THEN 1 END) as firmas_pendientes,
        COUNT(CASE WHEN cfp.id_usuario = $1 AND cfp.firmado = false THEN 1 END) > 0 as requiere_mi_firma
      FROM contrato c
      LEFT JOIN contrato_firma_pendiente cfp ON c.id_contrato = cfp.id_contrato
      WHERE 1=1
    `;
    const params = [userId];

    if (estado) {
      query += ` AND c.estado = $2`;
      params.push(estado);
    }

    query += ` GROUP BY c.id_contrato ORDER BY c.fecha_creacion DESC`;

    const result = await pool.query(query, params);

    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener contratos:', error);
    res.status(500).json({ error: 'Error al obtener contratos' });
  }
});

// Obtener un contrato por ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const contratoResult = await pool.query(
      'SELECT * FROM contrato WHERE id_contrato = $1',
      [id]
    );

    if (contratoResult.rows.length === 0) {
      return res.status(404).json({ error: 'Contrato no encontrado' });
    }

    const contrato = contratoResult.rows[0];

    // Obtener firmas pendientes
    const firmasResult = await pool.query(
      `SELECT 
        cfp.*,
        u.nombre || ' ' || u.ape_pat as nombre_usuario
       FROM contrato_firma_pendiente cfp
       INNER JOIN usuario u ON cfp.id_usuario = u.id_usuario
       WHERE cfp.id_contrato = $1
       ORDER BY cfp.orden`,
      [id]
    );

    res.json({
      ...contrato,
      firmantes: firmasResult.rows,
      firmas_pendientes: firmasResult.rows.filter(f => !f.firmado).length
    });
  } catch (error) {
    console.error('Error al obtener contrato:', error);
    res.status(500).json({ error: 'Error al obtener contrato' });
  }
});

// Crear un nuevo contrato
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { titulo, descripcion, url_archivo, firmantes } = req.body;

    if (!titulo || !url_archivo || !firmantes || !Array.isArray(firmantes) || firmantes.length === 0) {
      return res.status(400).json({ error: 'Título, archivo y firmantes son requeridos' });
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Crear contrato
      const contratoResult = await client.query(
        'INSERT INTO contrato (titulo, descripcion, url_archivo) VALUES ($1, $2, $3) RETURNING *',
        [titulo, descripcion, url_archivo]
      );

      const contrato = contratoResult.rows[0];

      // Crear firmas pendientes
      for (let i = 0; i < firmantes.length; i++) {
        await client.query(
          'INSERT INTO contrato_firma_pendiente (id_contrato, id_usuario, orden) VALUES ($1, $2, $3)',
          [contrato.id_contrato, firmantes[i].id_usuario, i + 1]
        );
      }

      await client.query('COMMIT');
      res.status(201).json(contrato);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error al crear contrato:', error);
    res.status(500).json({ error: 'Error al crear contrato' });
  }
});

// Firmar contrato
router.post('/:id/firmar', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id_usuario;
    const { firma_imagen } = req.body; // Imagen de la firma en base64

    // Verificar que el usuario tiene una firma pendiente
    const firmaPendiente = await pool.query(
      `SELECT * FROM contrato_firma_pendiente 
       WHERE id_contrato = $1 AND id_usuario = $2 AND firmado = false
       ORDER BY orden LIMIT 1`,
      [id, userId]
    );

    if (firmaPendiente.rows.length === 0) {
      return res.status(403).json({ error: 'No tienes una firma pendiente para este contrato' });
    }

    const firma = firmaPendiente.rows[0];

    // Actualizar firma pendiente
    await pool.query(
      'UPDATE contrato_firma_pendiente SET firmado = true, fecha_firma = NOW() WHERE id_firma = $1',
      [firma.id_firma]
    );

    // Verificar si todas las firmas están completas
    const firmasPendientes = await pool.query(
      'SELECT COUNT(*) as count FROM contrato_firma_pendiente WHERE id_contrato = $1 AND firmado = false',
      [id]
    );

    if (parseInt(firmasPendientes.rows[0].count) === 0) {
      // Todas las firmas están completas
      await pool.query(
        'UPDATE contrato SET estado = \'F\' WHERE id_contrato = $1',
        [id]
      );
    }

    res.json({ message: 'Contrato firmado correctamente' });
  } catch (error) {
    console.error('Error al firmar contrato:', error);
    res.status(500).json({ error: 'Error al firmar contrato' });
  }
});

// Rechazar contrato
router.post('/:id/rechazar', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id_usuario;
    const { motivo } = req.body;

    if (!motivo) {
      return res.status(400).json({ error: 'El motivo del rechazo es requerido' });
    }

    // Verificar que el usuario tiene una firma pendiente
    const firmaPendiente = await pool.query(
      `SELECT * FROM contrato_firma_pendiente 
       WHERE id_contrato = $1 AND id_usuario = $2 AND firmado = false AND rechazo = false
       ORDER BY orden LIMIT 1`,
      [id, userId]
    );

    if (firmaPendiente.rows.length === 0) {
      return res.status(403).json({ error: 'No tienes una firma pendiente para este contrato' });
    }

    const firma = firmaPendiente.rows[0];

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Marcar firma como rechazada
      await client.query(
        'UPDATE contrato_firma_pendiente SET rechazo = true, comentario_rechazo = $1 WHERE id_firma = $2',
        [motivo, firma.id_firma]
      );

      // Registrar rechazo
      await client.query(
        'INSERT INTO contrato_rechazo (id_contrato, id_usuario, motivo, id_firma_pendiente) VALUES ($1, $2, $3, $4)',
        [id, userId, motivo, firma.id_firma]
      );

      // Marcar contrato como rechazado
      await client.query(
        'UPDATE contrato SET estado = \'R\' WHERE id_contrato = $1',
        [id]
      );

      await client.query('COMMIT');
      res.json({ message: 'Contrato rechazado correctamente' });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error al rechazar contrato:', error);
    res.status(500).json({ error: 'Error al rechazar contrato' });
  }
});

module.exports = router;

