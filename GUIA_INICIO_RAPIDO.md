# Guía de Inicio Rápido - Sistema ENSA

## 🚀 Iniciar el Sistema Completo

### Paso 1: Configurar y Iniciar el Backend

1. **Navegar a la carpeta backend:**
   ```bash
   cd backend
   ```

2. **Instalar dependencias (solo la primera vez):**
   ```bash
   npm install
   ```

3. **Crear archivo `.env`:**
   Crea un archivo `.env` en la carpeta `backend/` con:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=Gobierno1
   DB_USER=postgres
   DB_PASSWORD=tu_password_de_postgres
   PORT=5000
   JWT_SECRET=una_clave_secreta_muy_segura_cambiala
   ```

4. **Iniciar el servidor backend:**
   ```bash
   npm start
   ```
   
   Deberías ver: `🚀 Servidor backend corriendo en el puerto 5000`

5. **Verificar que funciona:**
   Abre tu navegador en: `http://localhost:5000/api/health`
   
   Deberías ver:
   ```json
   {
     "status": "OK",
     "message": "Servidor funcionando correctamente",
     "database": "Gobierno1"
   }
   ```

### Paso 2: Configurar y Iniciar el Frontend

1. **Abrir una NUEVA terminal** (deja el backend corriendo)

2. **Navegar a la carpeta frontend:**
   ```bash
   cd ensa-login
   ```

3. **Verificar que existe el archivo `.env`:**
   Debe contener:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. **Iniciar el servidor frontend:**
   ```bash
   npm start
   ```
   
   Se abrirá automáticamente en: `http://localhost:3000`

### Paso 3: Crear Usuario de Prueba

1. **Hashear una contraseña:**
   En la terminal del backend:
   ```bash
   node scripts/hashPassword.js "123456"
   ```
   
   Copia el hash generado (ejemplo: `$2a$10$...`)

2. **Insertar usuario en PostgreSQL:**
   Abre pgAdmin y ejecuta:
   ```sql
   INSERT INTO usuario (nombre, ape_pat, ape_mat, correo, contrasena, id_rol, estado)
   VALUES (
     'Admin',
     'TI',
     'Sistema',
     'admin@ensa.com',
     'AQUI_PEGA_EL_HASH_GENERADO',  -- Pega el hash del paso anterior
     1,  -- ID del rol "Jefe de Tecnología de la Información y Comunicaciones"
     true
   );
   ```

   **Nota:** Verifica el `id_rol` correcto en tu tabla `ROL`.

### Paso 4: Iniciar Sesión

1. Abre `http://localhost:3000` en tu navegador
2. Ingresa:
   - **Correo:** `admin@ensa.com`
   - **Contraseña:** `123456`
3. Haz clic en "Iniciar sesión"

## ⚠️ Solución de Problemas

### Error: "Cannot connect to database"
- ✅ Verifica que PostgreSQL esté corriendo
- ✅ Verifica las credenciales en `backend/.env`
- ✅ Verifica que la base de datos `Gobierno1` exista

### Error: "Network Error" o "Failed to fetch"
- ✅ Verifica que el backend esté corriendo en el puerto 5000
- ✅ Verifica que `ensa-login/.env` tenga `REACT_APP_API_URL=http://localhost:5000/api`
- ✅ Reinicia el servidor frontend después de crear/modificar `.env`

### Error: "Credenciales inválidas"
- ✅ Verifica que la contraseña esté hasheada con bcrypt
- ✅ Verifica que el correo sea exactamente el mismo que en la BD
- ✅ Verifica que el usuario tenga `estado = true`

### El frontend no se conecta al backend
- ✅ Asegúrate de que AMBOS servidores estén corriendo:
  - Backend en puerto 5000
  - Frontend en puerto 3000
- ✅ Verifica que no haya errores en la consola del navegador (F12)
- ✅ Verifica que no haya errores en la terminal del backend

## 📋 Checklist de Verificación

Antes de usar el sistema, verifica:

- [ ] PostgreSQL está corriendo
- [ ] Base de datos `Gobierno1` existe
- [ ] Todas las tablas están creadas
- [ ] Datos iniciales (áreas y roles) están insertados
- [ ] Archivo `backend/.env` está configurado
- [ ] Backend está corriendo en puerto 5000
- [ ] Archivo `ensa-login/.env` existe y tiene la URL correcta
- [ ] Frontend está corriendo en puerto 3000
- [ ] Usuario de prueba está creado en la BD

## 🎯 Comandos Útiles

**Iniciar backend:**
```bash
cd backend
npm start
```

**Iniciar frontend:**
```bash
cd ensa-login
npm start
```

**Hashear contraseña:**
```bash
cd backend
node scripts/hashPassword.js "tu_contraseña"
```

**Verificar salud del backend:**
```bash
curl http://localhost:5000/api/health
```

## 📞 Estructura de Puertos

- **Backend:** `http://localhost:5000`
- **Frontend:** `http://localhost:3000`
- **PostgreSQL:** `localhost:5432`

