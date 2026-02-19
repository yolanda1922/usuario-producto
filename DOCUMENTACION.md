# Documentación API - Sistema de Usuarios y Productos

## 🚀 Estado General
✅ **SERVIDOR FUNCIONANDO COMPLETAMENTE**

El servidor Node.js está corriendo en `http://localhost:3000` con:
- MongoDB conectado
- Autenticación JWT implementada
- CORS habilitado
- Validación y encriptación de contraseñas

---

## 📋 RUTAS DISPONIBLES

### 1️⃣ PRODUCTOS (SIN AUTENTICACIÓN)

#### GET /api/v1/productos
Obtiene todos los productos
```bash
GET http://localhost:3000/api/v1/productos
```

#### POST /api/v1/productos
Crea un nuevo producto
```bash
POST http://localhost:3000/api/v1/productos
Body: {
  "nombre": "Laptop",
  "precio": 999.99
}
```

#### PUT /api/v1/productos/:id
Actualiza un producto
```bash
PUT http://localhost:3000/api/v1/productos/:id
Body: {
  "nombre": "Laptop Pro",
  "precio": 1299.99
}
```

#### DELETE /api/v1/productos/:id
Elimina un producto
```bash
DELETE http://localhost:3000/api/v1/productos/:id
```

---

### 2️⃣ AUTENTICACIÓN (SIN PROTECCIÓN)

#### POST /api/v1/usuarios/register
Registra un nuevo usuario
```bash
POST http://localhost:3000/api/v1/usuarios/register
Body: {
  "nombre": "Juan Pérez",
  "email": "juan@ejemplo.com",
  "password": "micontraseña123"
}
```

**Respuesta exitosa (201):**
```json
{
  "usuario": {
    "_id": "69971...",
    "nombre": "Juan Pérez",
    "email": "juan@ejemplo.com",
    "password": "$2b$10$hashedPassword",
    "createdAt": "2026-02-19T...",
    "updatedAt": "2026-02-19T..."
  }
}
```

#### POST /api/v1/usuarios/login
Genera un token JWT
```bash
POST http://localhost:3000/api/v1/usuarios/login
Body: {
  "email": "juan@ejemplo.com",
  "password": "micontraseña123"
}
```

**Respuesta exitosa (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Login exitoso",
  "usuario": {
    "id": "69971...",
    "nombre": "Juan Pérez",
    "email": "juan@ejemplo.com"
  }
}
```

**Detalles del Token:**
- Válido por: 1 hora
- Algoritmo: HS256
- Secret: Definido en `.env` (JWT_SECRET=nemo)

---

### 3️⃣ USUARIOS (CON AUTENTICACIÓN JWT)

**Header requerido:**
```
Authorization: Bearer <token>
```

#### GET /api/v1/usuarios
Obtiene lista de todos los usuarios
```bash
GET http://localhost:3000/api/v1/usuarios
Headers: {
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### GET /api/v1/usuarios/perfil/:id
Obtiene el perfil del usuario autenticado
```bash
GET http://localhost:3000/api/v1/usuarios/perfil/:id
Headers: {
  "Authorization": "Bearer <token>"
}
```

#### PUT /api/v1/usuarios/:id
Actualiza datos del usuario (requiere token válido; limpia espacios automáticamente)
```bash
PUT http://localhost:3000/api/v1/usuarios/:id
Headers: {
  "Authorization": "Bearer <token>"
}
Body: {
  "nombre": "Juan Actualizado",
  "email": "juannuevo@ejemplo.com",
  "password": "nuevacontraseña123"  // opcional
}
```

#### DELETE /api/v1/usuarios/:id
Elimina un usuario (requiere token válido)
```bash
DELETE http://localhost:3000/api/v1/usuarios/:id
Headers: {
  "Authorization": "Bearer <token>"
}
```

---

## 🔐 Características de Seguridad

### ✅ Encriptación de Contraseñas
- Algoritmo: **bcryptjs** (10 salts)
- Las contraseñas se hashean antes de guardarse

### ✅ Autenticación JWT
- Tokens con expiración de 1 hora
- Secret: Configurado en `.env`
- Verificación automática en rutas protegidas

### ✅ Validación de Datos
- **trim()**: Elimina espacios en blanco automáticamente
- Validación de email único
- Validación de campos requeridos

### ✅ CORS Habilitado
- Permite solicitudes de cualquier dominio

---

## 🛠️ Configuración

### Variables de Entorno (.env)
```
MONGODB_URI=mongodb://localhost:27017/usuarios-productos
PORT=3000
JWT_SECRET=nemo
```

### Dependencias
- **express**: Framework web
- **mongoose**: ODM para MongoDB
- **bcryptjs**: Encriptación de contraseñas
- **jsonwebtoken**: Generación de tokens JWT
- **cors**: CORS middleware
- **dotenv**: Gestión de variables de entorno

---

## 📝 Ejemplos de Uso Completo

### Flujo 1: Registrar y Hacer Login

**1. Registrar usuario:**
```bash
curl -X POST http://localhost:3000/api/v1/usuarios/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Carlos",
    "email": "carlos@ejemplo.com",
    "password": "password123"
  }'
```

**2. Hacer login:**
```bash
curl -X POST http://localhost:3000/api/v1/usuarios/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "carlos@ejemplo.com",
    "password": "password123"
  }'
```

**Respuesta:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3VhcmlvIjp7ImlkIjoiNjk5NzIxYTQ0MzU5YjMyYTdlMDVhYmQ2In0sImlhdCI6MTc3MTUxMjIzOCwiZXhwIjoxNzcxNTE1ODM4fQ.2Y_l7qrUlZsCZydrD_AsXxtPDED1ZrQndudVQ_fJKrM",
  "message": "Login exitoso",
  "usuario": {
    "id": "699721a44359b32a7e05abd6",
    "nombre": "Carlos",
    "email": "carlos@ejemplo.com"
  }
}
```

**3. Usar token para acceder a ruta protegida:**
```bash
curl -X GET http://localhost:3000/api/v1/usuarios \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3VhcmlvIjp7ImlkIjoiNjk5NzIxYTQ0MzU5YjMyYTdlMDVhYmQ2In0sImlhdCI6MTc3MTUxMjIzOCwiZXhwIjoxNzcxNTE1ODM4fQ.2Y_l7qrUlZsCZydrD_AsXxtPDED1ZrQndudVQ_fJKrM"
```

---

## ❌ Códigos de Error

| Código | Descripción |
|--------|-------------|
| **400** | Email ya registrado |
| **401** | Usuario no existe / Email o contraseña incorrecta / Token inválido |
| **404** | Recurso no encontrado |
| **500** | Error del servidor |

---

## 🎯 Resumen Rápido

| Método | Ruta | Auth | Descripción |
|--------|------|------|------------|
| GET | /api/v1/productos | ❌ | Listar productos |
| POST | /api/v1/productos | ❌ | Crear producto |
| PUT | /api/v1/productos/:id | ❌ | Actualizar producto |
| DELETE | /api/v1/productos/:id | ❌ | Eliminar producto |
| POST | /api/v1/usuarios/register | ❌ | Registrar usuario |
| POST | /api/v1/usuarios/login | ❌ | Login (obtener token) |
| GET | /api/v1/usuarios | ✅ | Listar usuarios |
| GET | /api/v1/usuarios/perfil/:id | ✅ | Obtener perfil |
| PUT | /api/v1/usuarios/:id | ✅ | Actualizar usuario |
| DELETE | /api/v1/usuarios/:id | ✅ | Eliminar usuario |

---

**Estado**: ✅ Servidor funcionando correctamente
**Última actualización**: 19 de febrero de 2026
