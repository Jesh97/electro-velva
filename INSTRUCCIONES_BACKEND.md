# Instrucciones para Configurar el Backend

## Paso 1: Instalar Dependencias

```bash
cd backend
npm install
```

## Paso 2: Configurar Base de Datos

1. Crea un archivo `.env` en la carpeta `backend/` con el siguiente contenido:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=Gobierno1
DB_USER=postgres
DB_PASSWORD=tu_password_de_postgres
PORT=5000
JWT_SECRET=una_clave_secreta_muy_segura_aqui_cambiala
```

**Importante:** Reemplaza `tu_password_de_postgres` con tu contraseña real de PostgreSQL.

## Paso 3: Crear Base de Datos y Tablas

1. Abre pgAdmin 4
2. Conéctate a tu servidor PostgreSQL
3. Crea una nueva base de datos llamada `Gobierno1`
4. Ejecuta los scripts SQL proporcionados para crear todas las tablas
5. Inserta los datos iniciales (áreas y roles)

## Paso 4: Crear Usuario de Prueba

Para crear un usuario de prueba, primero hashea la contraseña:

```bash
cd backend
node scripts/hashPassword.js "123456"
```

Copia el hash generado y úsalo en este SQL:

```sql
-- Ejemplo: Insertar un jefe de TI
INSERT INTO usuario (nombre, ape_pat, ape_mat, correo, contrasena, id_rol, estado)
VALUES (
  'Admin',
  'TI',
  'Sistema',
  'admin@ensa.com',
  'AQUI_PEGA_EL_HASH_GENERADO', -- Hash de bcrypt
  1, -- ID del rol "Jefe de Tecnología de la Información y Comunicaciones"
  true
);
```

**Nota:** El `id_rol` debe corresponder al rol que quieres asignar. Verifica los IDs de los roles en la tabla `ROL`.

## Paso 5: Iniciar el Servidor

```bash
npm start
```

O para desarrollo con auto-reload:

```bash
npm run dev
```

El servidor estará disponible en `http://localhost:5000`

## Paso 6: Verificar que Funciona

Visita `http://localhost:5000/api/health` en tu navegador. Deberías ver:

```json
{
  "status": "OK",
  "message": "Servidor funcionando correctamente",
  "database": "Gobierno1"
}
```

## Estructura de Archivos

```
backend/
├── config/
│   └── database.js          # Configuración de PostgreSQL
├── middleware/
│   └── auth.js              # Middleware de autenticación JWT
├── routes/
│   ├── auth.js              # Rutas de autenticación
│   ├── incidentes.js        # Rutas de incidentes
│   └── contratos.js        # Rutas de contratos
├── scripts/
│   └── hashPassword.js      # Script para hashear contraseñas
├── server.js                # Servidor principal
├── package.json
└── .env                     # Variables de entorno (crear manualmente)
```

## Endpoints Disponibles

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/verify` - Verificar token

### Incidentes
- `GET /api/incidentes` - Listar incidentes
- `GET /api/incidentes/:id` - Obtener un incidente
- `POST /api/incidentes` - Crear incidente
- `PATCH /api/incidentes/:id/gestionar` - Gestionar incidente (Jefe de TI)
- `POST /api/incidentes/:id/tomar` - Tomar incidente (Técnico)
- `PATCH /api/incidentes/:id/terminar` - Terminar incidente (Jefe de TI)
- `GET /api/incidentes/categorias` - Obtener categorías
- `GET /api/incidentes/tecnicos/disponibles` - Obtener técnicos

### Contratos
- `GET /api/contratos` - Listar contratos
- `GET /api/contratos/:id` - Obtener un contrato
- `POST /api/contratos` - Crear contrato
- `POST /api/contratos/:id/firmar` - Firmar contrato
- `POST /api/contratos/:id/rechazar` - Rechazar contrato

## Solución de Problemas

### Error: "Cannot connect to database"
- Verifica que PostgreSQL esté corriendo
- Verifica las credenciales en `.env`
- Verifica que la base de datos `Gobierno1` exista

### Error: "Module not found"
- Ejecuta `npm install` en la carpeta `backend`

### Error de autenticación
- Verifica que las contraseñas en la BD estén hasheadas con bcrypt
- Verifica que el JWT_SECRET esté configurado

