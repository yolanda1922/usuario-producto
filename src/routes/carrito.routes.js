const express = require('express');
const auth = require('../middleware/auth');
const {
    getCarrito,
    agregarAlCarrito,
    eliminarDelCarrito,
    actualizarCarrito,
    limpiarCarrito
} = require('../controllers/cart.controllers');

const router = express.Router();

// Obtener carrito
router.get('/carrito/:usuarioId', auth, getCarrito);

// Agregar producto al carrito
router.post('/carrito/:usuarioId/agregar/:productoId', auth, agregarAlCarrito);

// Eliminar producto del carrito
router.delete('/carrito/:usuarioId/eliminar/:productoId', auth, eliminarDelCarrito);

// Actualizar cantidad en carrito
router.put('/carrito/:usuarioId/actualizar/:productoId', auth, actualizarCarrito);

// Limpiar carrito
router.delete('/carrito/:usuarioId/limpiar', auth, limpiarCarrito);

module.exports = router;
