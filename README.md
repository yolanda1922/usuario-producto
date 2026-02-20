# API de Usuarios y Productos

Sistema REST API construido con Node.js, Express y MongoDB para gestionar usuarios y productos con autenticación JWT.

## 🚀 Características

- ✅ Autenticación con JWT
- ✅ Encriptación de contraseñas con bcryptjs
- ✅ CRUD completo para usuarios y productos
- ✅ Validación de datos
- ✅ Manejo de errores robusto
- ✅ Arquitectura con controladores y routers
- ✅ Smoke tests automatizados

## 📋 Tecnologías

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **MongoDB** - Base de datos
- **Mongoose** - ODM para MongoDB
- **bcryptjs** - Encriptación de contraseñas
- **jsonwebtoken** - Generación de tokens JWT
- **CORS** - Control de acceso entre dominios
- **dotenv** - Gestión de variables de entorno

## 📁 Estructura del Proyecto

```
usuario-producto/
├── src/
│   ├── config/
│   │   └── db.js                 # Conexión MongoDB
│   ├── controllers/
│   │   ├── usuario.controllers.js
│   │   └── producto.controllers.js
│   ├── middleware/
│   │   └── auth.js              # Middleware JWT
│   ├── models/
│   │   ├── usuario.js
│   │   └── producto.js
│   ├── routes/
│   │   ├── usuarios.routes.js
│   │   └── productos.routes.js
│   └── index.js                 # Entrada principal
├── scripts/
│   └── smoke.ps1               # Tests de validación
├── .env                         # Variables de entorno
├── package.json
└── README.md
```

## 🔧 Instalación

1. Clonar el repositorio:
```bash
git clone <url-repo>
cd usuario-producto
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno (`.env`):
```env
MONGODB_URI=mongodb://localhost:27017/usuarios-productos
PORT=3000
JWT_SECRET=tu-secret-key
```

4. Asegurar que MongoDB está corriendo en `localhost:27017`

## ▶️ Ejecución

**Modo desarrollo** (con hot reload):
```bash
npm run dev
```

**Ejecutar tests de validación**:
```bash
npm run smoke
```

El servidor estará disponible en `http://localhost:3000`

## 📚 API Endpoints

### Autenticación (sin protección)

#### Registro
```bash
POST /api/v1/usuarios/register
Content-Type: application/json

{
  "nombre": "Juan Pérez",
  "email": "juan@ejemplo.com",
  "password": "contraseña123"
}
```

**Respuesta (201)**:
```json
{
  "usuario": {
    "_id": "...",
    "nombre": "Juan Pérez",
    "email": "juan@ejemplo.com"
  }
}
```

#### Login
```bash
POST /api/v1/usuarios/login
Content-Type: application/json

{
  "email": "juan@ejemplo.com",
  "password": "contraseña123"
}
```

**Respuesta (200)**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "message": "Login exitoso",
  "usuario": {
    "id": "...",
    "nombre": "Juan Pérez",
    "email": "juan@ejemplo.com"
  }
}
```

### Usuarios (requiere autenticación)

#### Listar usuarios
```bash
GET /api/v1/usuarios
Authorization: Bearer <token>
```

#### Obtener perfil
```bash
GET /api/v1/usuarios/perfil/:id
Authorization: Bearer <token>
```

#### Verificar usuario
```bash
GET /api/v1/usuarios/verificar
Authorization: Bearer <token>
```

#### Actualizar usuario
```bash
PUT /api/v1/usuarios/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "nombre": "Nuevo nombre",
  "email": "nuevo@ejemplo.com",
  "password": "nuevacontraseña"
}
```

#### Eliminar usuario
```bash
DELETE /api/v1/usuarios/:id
Authorization: Bearer <token>
```

### Productos (sin autenticación)

#### Listar productos
```bash
GET /api/v1/productos
```

#### Crear producto
```bash
POST /api/v1/productos
Content-Type: application/json

{
  "nombre": "Laptop",
  "precio": 999.99
}
```

#### Actualizar producto
```bash
PUT /api/v1/productos/:id
Content-Type: application/json

{
  "nombre": "Laptop Pro",
  "precio": 1299.99
}
```

#### Eliminar producto
```bash
DELETE /api/v1/productos/:id
```

## 🔐 Autenticación

Los endpoints protegidos requieren un token JWT en el header:

```
Authorization: Bearer <token>
```

El token es válido por **1 hora** y se genera con la clave `JWT_SECRET` definida en `.env`

## ✅ Validaciones

- Email único y requerido
- Contraseña encriptada con bcryptjs (10 salts)
- Campos obligatorios validados
- Ids MongoDB válidos

## ❌ Códigos de Error

| Código | Descripción |
|--------|-------------|
| **400** | Email duplicado, campos faltantes |
| **401** | Token inválido o no proporcionado, credenciales incorrectas |
| **404** | Recurso no encontrado |
| **500** | Error del servidor |

## 🧪 Testing

El proyecto incluye un script de smoke test que valida:

- Acceso sin token (401)
- IDs inválidos (404)
- Cambio de contraseña
- Validaciones de dupliación y campos faltantes

Ejecutar:
```bash
npm run smoke
```

## 📝 Notas

- Las contraseñas se hashean automáticamente antes de guardarse
- Los espacios en emails se limpian automáticamente con `trim()`
- Las respuestas no incluyen contraseñas (se usan `.select('-password')`)

## 📧 Soporte

Para preguntas o issues, contacta al equipo de desarrollo.
nemotecmed@yahoo.es

**Última actualización**: 19 de febrero de 2026
