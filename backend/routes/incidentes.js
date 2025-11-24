const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

// Obtener todas las categorías
router.get('/categorias', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categoria ORDER BY nombre');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
});

// Obtener todos los incidentes (con filtros)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { estado, id_usuario, tipo_usuario, solo_asignados, id_incidente } = req.query;
    const userId = req.user.id_usuario;

    let query;
    let params = [];

    if (id_incidente) {
      // Obtener un incidente específico
      query = `
        SELECT 
          i.*,
          c.nombre as categoria_nombre,
          u.nombre || ' ' || u.ape_pat as usuario_reporte_nombre,
          u.nombre as usuario_reporte_nombre_solo,
          u.ape_pat as usuario_reporte_ape_pat,
          t.nombre || ' ' || t.ape_pat as tecnico_asignado_nombre,
          (SELECT COUNT(*) FROM equipo_tecnico et WHERE et.id_incidente = i.id_incidente) as usuarios_asignados
        FROM incidente i
        INNER JOIN categoria c ON i.id_categoria = c.id_categoria
        INNER JOIN usuario u ON i.id_usuario = u.id_usuario
        LEFT JOIN usuario t ON i.id_tecnico_asignado = t.id_usuario
        WHERE i.id_incidente = $1
      `;
      params = [id_incidente];
    } else if (tipo_usuario === 'jefe_ti') {
      // Jefe de TI ve todos los incidentes pendientes y en progreso
      query = `
        SELECT 
          i.*,
          c.nombre as categoria_nombre,
          u.nombre || ' ' || u.ape_pat as usuario_reporte_nombre,
          u.nombre as usuario_reporte_nombre_solo,
          u.ape_pat as usuario_reporte_ape_pat,
          t.nombre || ' ' || t.ape_pat as tecnico_asignado_nombre,
          (SELECT COUNT(*) FROM equipo_tecnico et WHERE et.id_incidente = i.id_incidente) as usuarios_asignados
        FROM incidente i
        INNER JOIN categoria c ON i.id_categoria = c.id_categoria
        INNER JOIN usuario u ON i.id_usuario = u.id_usuario
        LEFT JOIN usuario t ON i.id_tecnico_asignado = t.id_usuario
        WHERE ${estado ? "i.estado = $1" : "1=1"}
        ORDER BY i.fecha_reporte DESC
      `;
      if (estado) params = [estado];
    } else if (tipo_usuario === 'tecnico') {
      const idUsuario = parseInt(id_usuario);
      const soloAsignados = req.query.solo_asignados === 'true';
      
      if (soloAsignados) {
        // Incidentes asignados específicamente
        query = `
          SELECT DISTINCT
            i.*,
            c.nombre as categoria_nombre,
            u.nombre || ' ' || u.ape_pat as usuario_reporte_nombre,
            u.nombre as usuario_reporte_nombre_solo,
            u.ape_pat as usuario_reporte_ape_pat,
            (SELECT COUNT(*) FROM equipo_tecnico et WHERE et.id_incidente = i.id_incidente) as usuarios_asignados,
            CASE 
              WHEN i.id_tecnico_asignado = $1 THEN true ELSE false
            END as es_responsable,
            (SELECT json_agg(json_build_object('id_usuario', et2.id_usuario, 'nombre', u2.nombre, 'ape_pat', u2.ape_pat))
             FROM equipo_tecnico et2
             INNER JOIN usuario u2 ON et2.id_usuario = u2.id_usuario
             WHERE et2.id_incidente = i.id_incidente) as equipo
          FROM incidente i
          INNER JOIN categoria c ON i.id_categoria = c.id_categoria
          INNER JOIN usuario u ON i.id_usuario = u.id_usuario
          WHERE i.estado = 'A'
            AND (
              i.id_tecnico_asignado = $1
              OR EXISTS (
                SELECT 1 FROM equipo_tecnico et 
                WHERE et.id_incidente = i.id_incidente AND et.id_usuario = $1
              )
            )
          ORDER BY i.fecha_reporte DESC
        `;
        params = [idUsuario];
      } else {
        // Incidentes disponibles (B/M que no están llenos)
        query = `
          SELECT 
            i.*,
            c.nombre as categoria_nombre,
            u.nombre || ' ' || u.ape_pat as usuario_reporte_nombre,
            u.nombre as usuario_reporte_nombre_solo,
            u.ape_pat as usuario_reporte_ape_pat,
            (SELECT COUNT(*) FROM equipo_tecnico et WHERE et.id_incidente = i.id_incidente) as usuarios_asignados,
            CASE 
              WHEN EXISTS (SELECT 1 FROM equipo_tecnico et WHERE et.id_incidente = i.id_incidente AND et.id_usuario = $1)
              THEN true ELSE false
            END as ya_asignado
          FROM incidente i
          INNER JOIN categoria c ON i.id_categoria = c.id_categoria
          INNER JOIN usuario u ON i.id_usuario = u.id_usuario
          WHERE i.estado = 'A'
            AND i.nivel IN ('B', 'M')
            AND (
              (i.nivel = 'B' AND (SELECT COUNT(*) FROM equipo_tecnico et WHERE et.id_incidente = i.id_incidente) < 3)
              OR
              (i.nivel = 'M' AND (SELECT COUNT(*) FROM equipo_tecnico et WHERE et.id_incidente = i.id_incidente) < 5)
            )
          ORDER BY i.fecha_reporte DESC
        `;
        params = [idUsuario];
      }
    } else {
      // Jefe normal ve solo sus incidentes reportados
      query = `
        SELECT 
          i.*,
          c.nombre as categoria_nombre,
          u.nombre || ' ' || u.ape_pat as usuario_reporte_nombre,
          u.nombre as usuario_reporte_nombre_solo,
          u.ape_pat as usuario_reporte_ape_pat,
          t.nombre || ' ' || t.ape_pat as tecnico_asignado_nombre,
          (SELECT COUNT(*) FROM equipo_tecnico et WHERE et.id_incidente = i.id_incidente) as usuarios_asignados
        FROM incidente i
        INNER JOIN categoria c ON i.id_categoria = c.id_categoria
        INNER JOIN usuario u ON i.id_usuario = u.id_usuario
        LEFT JOIN usuario t ON i.id_tecnico_asignado = t.id_usuario
        WHERE i.id_usuario = $1
          ${estado ? "AND i.estado = $2" : ""}
        ORDER BY i.fecha_reporte DESC
      `;
      params = [userId];
      if (estado) params.push(estado);
    }

    const result = await pool.query(query, params);

    // Formatear resultados
    const incidentes = result.rows.map(row => ({
      id_incidente: row.id_incidente,
      titulo: row.titulo,
      descripcion: row.descripcion,
      estado: row.estado,
      nivel: row.nivel,
      id_categoria: row.id_categoria,
      id_usuario: row.id_usuario,
      id_tecnico_asignado: row.id_tecnico_asignado,
      fecha_reporte: row.fecha_reporte,
      fecha_resolucion: row.fecha_resolucion,
      categoria: { nombre: row.categoria_nombre },
      usuario_reporte: {
        nombre: row.usuario_reporte_nombre_solo || row.usuario_reporte_nombre?.split(' ')[0],
        ape_pat: row.usuario_reporte_ape_pat || row.usuario_reporte_nombre?.split(' ')[1]
      },
      tecnico_asignado: row.tecnico_asignado_nombre,
      usuarios_asignados: parseInt(row.usuarios_asignados || 0),
      ya_asignado: row.ya_asignado,
      es_responsable: row.es_responsable || false,
      equipo: row.equipo || []
    }));

    res.json(incidentes);
  } catch (error) {
    console.error('Error al obtener incidentes:', error);
    res.status(500).json({ error: 'Error al obtener incidentes' });
  }
});

// Obtener un incidente por ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT 
        i.*,
        c.nombre as categoria_nombre,
        u.nombre || ' ' || u.ape_pat as usuario_reporte_nombre,
        u.nombre as usuario_reporte_nombre_solo,
        u.ape_pat as usuario_reporte_ape_pat,
        t.nombre || ' ' || t.ape_pat as tecnico_asignado_nombre,
        (SELECT COUNT(*) FROM equipo_tecnico et WHERE et.id_incidente = i.id_incidente) as usuarios_asignados
      FROM incidente i
      INNER JOIN categoria c ON i.id_categoria = c.id_categoria
      INNER JOIN usuario u ON i.id_usuario = u.id_usuario
      LEFT JOIN usuario t ON i.id_tecnico_asignado = t.id_usuario
      WHERE i.id_incidente = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Incidente no encontrado' });
    }

    const row = result.rows[0];
    const incidente = {
      id_incidente: row.id_incidente,
      titulo: row.titulo,
      descripcion: row.descripcion,
      estado: row.estado,
      nivel: row.nivel,
      id_categoria: row.id_categoria,
      id_usuario: row.id_usuario,
      id_tecnico_asignado: row.id_tecnico_asignado,
      fecha_reporte: row.fecha_reporte,
      fecha_resolucion: row.fecha_resolucion,
      categoria: { nombre: row.categoria_nombre },
      usuario_reporte: {
        nombre: row.usuario_reporte_nombre_solo || row.usuario_reporte_nombre?.split(' ')[0],
        ape_pat: row.usuario_reporte_ape_pat
      },
      tecnico_asignado: row.tecnico_asignado_nombre,
      usuarios_asignados: parseInt(row.usuarios_asignados || 0)
    };

    res.json(incidente);
  } catch (error) {
    console.error('Error al obtener incidente:', error);
    res.status(500).json({ error: 'Error al obtener incidente' });
  }
});

// Crear un nuevo incidente
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { titulo, descripcion, id_categoria } = req.body;
    const id_usuario = req.user.id_usuario;

    if (!titulo || !descripcion || !id_categoria) {
      return res.status(400).json({ error: 'Título, descripción y categoría son requeridos' });
    }

    const result = await pool.query(
      `INSERT INTO incidente (titulo, descripcion, id_categoria, id_usuario, estado, nivel)
       VALUES ($1, $2, $3, $4, 'P', 'B')
       RETURNING *`,
      [titulo, descripcion, id_categoria, id_usuario]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear incidente:', error);
    res.status(500).json({ error: 'Error al crear incidente' });
  }
});

// Gestionar incidente (Jefe de TI: aceptar, asignar, cancelar)
router.patch('/:id/gestionar', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { estado, nivel, id_tecnico_asignado, equipo, responsable_grupo } = req.body;

    // Verificar que el usuario es jefe de TI
    if (req.user.tipo_rol !== 'J' || req.user.id_area !== 1) {
      return res.status(403).json({ error: 'No tienes permisos para gestionar incidentes' });
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Obtener estado anterior
      const incidenteAnterior = await client.query(
        'SELECT estado, nivel, id_tecnico_asignado FROM incidente WHERE id_incidente = $1',
        [id]
      );

      if (incidenteAnterior.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ error: 'Incidente no encontrado' });
      }

      const estadoAnterior = incidenteAnterior.rows[0].estado;
      const nivelAnterior = incidenteAnterior.rows[0].nivel;
      const tecnicoAnterior = incidenteAnterior.rows[0].id_tecnico_asignado;

      // Actualizar incidente
      let updateQuery = 'UPDATE incidente SET ';
      const updateParams = [];
      let paramCount = 1;

      if (estado) {
        updateQuery += `estado = $${paramCount}, `;
        updateParams.push(estado);
        paramCount++;
      }

      if (nivel) {
        updateQuery += `nivel = $${paramCount}, `;
        updateParams.push(nivel);
        paramCount++;
      }

      if (id_tecnico_asignado !== undefined) {
        updateQuery += `id_tecnico_asignado = $${paramCount}, `;
        updateParams.push(id_tecnico_asignado);
        paramCount++;
      }

      updateQuery = updateQuery.slice(0, -2); // Remover última coma
      updateQuery += ` WHERE id_incidente = $${paramCount} RETURNING *`;
      updateParams.push(id);

      const result = await client.query(updateQuery, updateParams);

      // Si hay equipo técnico, agregarlo
      if (equipo && Array.isArray(equipo) && equipo.length > 0) {
        for (const idTecnico of equipo) {
          await client.query(
            'INSERT INTO equipo_tecnico (id_incidente, id_usuario) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [id, idTecnico]
          );
        }
      }

      // Registrar en historial
      await client.query(
        `INSERT INTO historial_incidente 
         (id_incidente, estado_anterior, estado_nuevo, tecnico_anterior, tecnico_nuevo, prioridad_anterior, prioridad_nueva)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [id, estadoAnterior, estado || estadoAnterior, tecnicoAnterior, id_tecnico_asignado || tecnicoAnterior, nivelAnterior, nivel || nivelAnterior]
      );

      await client.query('COMMIT');
      res.json(result.rows[0]);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error al gestionar incidente:', error);
    res.status(500).json({ error: 'Error al gestionar incidente' });
  }
});

// Tomar incidente (Técnico)
router.post('/:id/tomar', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const id_usuario = req.user.id_usuario;

    // Verificar que el usuario es técnico
    if (req.user.tipo_rol !== 'T') {
      return res.status(403).json({ error: 'Solo los técnicos pueden tomar incidentes' });
    }

    // Verificar límite de tickets activos (máximo 3, excepto críticos o asignados)
    const ticketsActivos = await pool.query(
      `SELECT COUNT(*) as count
       FROM incidente i
       WHERE i.estado = 'A'
         AND (
           i.id_tecnico_asignado = $1
           OR EXISTS (SELECT 1 FROM equipo_tecnico et WHERE et.id_incidente = i.id_incidente AND et.id_usuario = $1)
         )`,
      [id_usuario]
    );

    const count = parseInt(ticketsActivos.rows[0].count);

    // Obtener información del incidente
    const incidente = await pool.query(
      'SELECT nivel, id_tecnico_asignado FROM incidente WHERE id_incidente = $1',
      [id]
    );

    if (incidente.rows.length === 0) {
      return res.status(404).json({ error: 'Incidente no encontrado' });
    }

    const nivel = incidente.rows[0].nivel;
    const yaAsignado = incidente.rows[0].id_tecnico_asignado;

    // Verificar límite (excepto si es crítico o ya está asignado)
    if (count >= 3 && nivel !== 'C' && !yaAsignado) {
      return res.status(400).json({ error: 'Has alcanzado el límite de 3 tickets activos' });
    }

    // Agregar al equipo técnico
    await pool.query(
      'INSERT INTO equipo_tecnico (id_incidente, id_usuario) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [id, id_usuario]
    );

    res.json({ message: 'Incidente tomado correctamente' });
  } catch (error) {
    console.error('Error al tomar incidente:', error);
    res.status(500).json({ error: 'Error al tomar incidente' });
  }
});

// Terminar incidente (Jefe de TI)
router.patch('/:id/terminar', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que el usuario es jefe de TI
    if (req.user.tipo_rol !== 'J' || req.user.id_area !== 1) {
      return res.status(403).json({ error: 'No tienes permisos para terminar incidentes' });
    }

    const result = await pool.query(
      `UPDATE incidente 
       SET estado = 'T', fecha_resolucion = NOW()
       WHERE id_incidente = $1
       RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Incidente no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al terminar incidente:', error);
    res.status(500).json({ error: 'Error al terminar incidente' });
  }
});

// Obtener técnicos disponibles
router.get('/tecnicos/disponibles', authenticateToken, async (req, res) => {
  try {
    // Verificar que el usuario es jefe de TI
    if (req.user.tipo_rol !== 'J' || req.user.id_area !== 1) {
      return res.status(403).json({ error: 'No tienes permisos' });
    }

    const result = await pool.query(
      `SELECT 
        u.id_usuario,
        u.nombre,
        u.ape_pat,
        u.ape_mat,
        COUNT(CASE WHEN i.estado = 'A' THEN 1 END) as tickets_activos
       FROM usuario u
       INNER JOIN rol r ON u.id_rol = r.id_rol
       LEFT JOIN incidente i ON (i.id_tecnico_asignado = u.id_usuario OR EXISTS (
         SELECT 1 FROM equipo_tecnico et WHERE et.id_usuario = u.id_usuario AND et.id_incidente = i.id_incidente
       )) AND i.estado = 'A'
       WHERE r.tipo = 'T' AND u.estado = true
       GROUP BY u.id_usuario, u.nombre, u.ape_pat, u.ape_mat
       ORDER BY u.nombre`
    );

    res.json(result.rows.map(row => ({
      id_usuario: row.id_usuario,
      nombre: row.nombre,
      ape_pat: row.ape_pat,
      ape_mat: row.ape_mat,
      tickets_activos: parseInt(row.tickets_activos || 0)
    })));
  } catch (error) {
    console.error('Error al obtener técnicos:', error);
    res.status(500).json({ error: 'Error al obtener técnicos' });
  }
});

module.exports = router;

