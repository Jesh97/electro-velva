# Instrucciones para Conectar Frontend con Backend

## ⚠️ Problema Común

Si el frontend no se conecta al backend, es porque:
1. El backend no está corriendo
2. El archivo `.env` del frontend no existe o está mal configurado
3. Los puertos están ocupados o incorrectos

## ✅ Solución Paso a Paso

### 1. Verificar que el Backend esté Corriendo

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

Deberías ver:
```
🚀 Servidor backend corriendo en el puerto 5000
📊 Base de datos: Gobierno1
✅ Conectado a PostgreSQL - Base de datos: Gobierno1
```

**Verificar en el navegador:**
Abre: `http://localhost:5000/api/health`

Deberías ver:
```json
{
  "status": "OK",
  "message": "Servidor funcionando correctamente",
  "database": "Gobierno1"
}
```

### 2. Crear Archivo .env en el Frontend

**Crear manualmente el archivo `ensa-login/.env`:**

1. Ve a la carpeta `ensa-login/`
2. Crea un archivo llamado `.env` (sin extensión)
3. Agrega esta línea:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

**O desde la terminal (PowerShell):**
```powershell
cd ensa-login
"REACT_APP_API_URL=http://localhost:5000/api" | Out-File -FilePath .env -Encoding utf8
```

### 3. Reiniciar el Frontend

**IMPORTANTE:** Después de crear o modificar el archivo `.env`, DEBES reiniciar el servidor frontend:

1. Detén el servidor frontend (Ctrl+C)
2. Inicia de nuevo:
   ```bash
   cd ensa-login
   npm start
   ```

### 4. Verificar la Conexión

1. Abre el navegador en `http://localhost:3000`
2. Abre la consola del navegador (F12)
3. Intenta hacer login
4. Verifica que no haya errores de red en la pestaña "Network"

## 🔍 Verificar que Todo Esté Bien

### Backend:
- ✅ Puerto 5000 está libre
- ✅ Archivo `backend/.env` existe y está configurado
- ✅ Base de datos `Gobierno1` existe
- ✅ Servidor muestra "Conectado a PostgreSQL"

### Frontend:
- ✅ Puerto 3000 está libre
- ✅ Archivo `ensa-login/.env` existe con `REACT_APP_API_URL=http://localhost:5000/api`
- ✅ Servidor frontend se reinició después de crear `.env`

## 🐛 Errores Comunes

### Error: "Network Error" o "Failed to fetch"
**Causa:** El frontend no puede alcanzar el backend

**Solución:**
1. Verifica que el backend esté corriendo
2. Verifica que `ensa-login/.env` tenga la URL correcta
3. Reinicia el frontend

### Error: "CORS policy"
**Causa:** El backend no permite peticiones desde el frontend

**Solución:**
- El backend ya tiene CORS configurado, pero verifica que esté corriendo

### Error: "Cannot read property 'token' of undefined"
**Causa:** El backend no está respondiendo correctamente

**Solución:**
1. Verifica que el backend esté corriendo
2. Verifica la respuesta en la consola del navegador (F12 > Network)

## 📝 Estructura de Archivos

```
electro-velva/
├── backend/
│   ├── .env                    ← Debe existir con credenciales de BD
│   └── server.js
├── ensa-login/
│   ├── .env                    ← Debe existir con REACT_APP_API_URL
│   └── src/
│       ├── services/
│       │   └── api.js          ← Usa process.env.REACT_APP_API_URL
│       └── pages/
│           └── LoginPage.jsx   ← Usa authAPI.login()
```

## 🚀 Comandos para Iniciar Todo

**Terminal 1 (Backend):**
```bash
cd backend
npm start
```

**Terminal 2 (Frontend):**
```bash
cd ensa-login
npm start
```

## ✅ Checklist Final

Antes de probar el login, verifica:

- [ ] Backend corriendo en puerto 5000
- [ ] Frontend corriendo en puerto 3000
- [ ] Archivo `ensa-login/.env` existe
- [ ] `REACT_APP_API_URL=http://localhost:5000/api` en `.env`
- [ ] Frontend se reinició después de crear `.env`
- [ ] Base de datos tiene al menos un usuario
- [ ] Usuario tiene contraseña hasheada con bcrypt

## 🎯 Prueba Rápida

1. Abre `http://localhost:5000/api/health` → Debe mostrar JSON con status OK
2. Abre `http://localhost:3000` → Debe mostrar la página de login
3. Intenta hacer login con un usuario de la BD
4. Si falla, revisa la consola del navegador (F12) para ver el error exacto

