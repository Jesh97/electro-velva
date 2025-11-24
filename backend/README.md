# Backend de la aplicación ENSA

Este es el backend de la aplicación ENSA, construido con Node.js, Express y PostgreSQL.

## Configuración

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Crear archivo `.env`:**
   Copia `.env.example` a `.env` y configura las variables:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=Gobierno1
   DB_USER=postgres
   DB_PASSWORD=tu_password_de_postgres
   PORT=5000
   JWT_SECRET=tu_secret_key_muy_segura_aqui
   ```

3. **Iniciar el servidor:**
   ```bash
   npm start
   ```
   O para desarrollo con auto-reload:
   ```bash
   npm run dev
   ```

## Rutas API

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/verify` - Verificar token

### Incidentes
- `GET /api/incidentes` - Obtener todos los incidentes (con filtros)
- `GET /api/incidentes/:id` - Obtener un incidente por ID
- `POST /api/incidentes` - Crear un nuevo incidente
- `PATCH /api/incidentes/:id/gestionar` - Gestionar incidente (Jefe de TI)
- `POST /api/incidentes/:id/tomar` - Tomar incidente (Técnico)
- `PATCH /api/incidentes/:id/terminar` - Terminar incidente (Jefe de TI)
- `GET /api/incidentes/categorias` - Obtener categorías
- `GET /api/incidentes/tecnicos/disponibles` - Obtener técnicos disponibles

### Contratos
- `GET /api/contratos` - Obtener todos los contratos
- `GET /api/contratos/:id` - Obtener un contrato por ID
- `POST /api/contratos` - Crear un nuevo contrato
- `POST /api/contratos/:id/firmar` - Firmar contrato
- `POST /api/contratos/:id/rechazar` - Rechazar contrato

## Crear Usuario de Prueba

Para crear un usuario de prueba, usa el script para hashear la contraseña:

```bash
node scripts/hashPassword.js "123456"
```

Luego inserta en PostgreSQL:

```sql
-- Ejemplo: Insertar un jefe de TI
INSERT INTO usuario (nombre, ape_pat, ape_mat, correo, contrasena, id_rol, estado)
VALUES (
  'Admin',
  'TI',
  'Sistema',
  'admin@ensa.com',
  '$2a$10$...', -- Hash generado por el script
  1, -- ID del rol "Jefe de Tecnología de la Información y Comunicaciones"
  true
);
```

## Verificar Conexión

Visita `http://localhost:5000/api/health` para verificar que el servidor y la base de datos estén funcionando correctamente.

