const express = require('express');
const auth = require('../middleware/auth');
const {
    registerUsuario,
    loginUsuario,
    logoutUsuario,
    verificarUsuario,
    getUsuarios,
    getPerfilUsuario,
    updateUsuario,
    deleteUsuario
} = require('../controllers/usuario.controllers');

const router = express.Router();

// Registrar usuario
router.post('/usuarios/register', registerUsuario);//url: http://localhost:3000/api/v1/usuarios/register

// Login usuario
router.post('/usuarios/login', loginUsuario);//url: http://localhost:3000/api/v1/usuarios/login

// Logout usuario
router.post('/usuarios/logout', auth, logoutUsuario);//url: http://localhost:3000/api/v1/usuarios/logout

// Verificar usuario autenticado
router.get('/usuarios/verificar', auth, verificarUsuario);//url: http://localhost:3000/api/v1/usuarios/verificar

// Obtener todos los usuarios
router.get('/usuarios', getUsuarios);//url: http://localhost:3000/api/v1/usuarios

// Obtener perfil de usuario
router.get('/usuarios/perfil/:id', auth, getPerfilUsuario);//url: http://localhost:3000/api/v1/usuarios/perfil/:id

// Actualizar usuario
router.put('/usuarios/:id', auth, updateUsuario);//url: http://localhost:3000/api/v1/usuarios/:id

// Eliminar usuario
router.delete('/usuarios/:id', auth, deleteUsuario);//url: http://localhost:3000/api/v1/usuarios/:id

module.exports = router;

            