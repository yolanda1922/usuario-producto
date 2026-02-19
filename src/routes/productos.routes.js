const express = require('express');
const {
	getProductos,
	createProducto,
	updateProducto,
	deleteProducto
} = require('../controllers/producto.controllers');

const router = express.Router();

// Obtener todos los productos
router.get('/productos', getProductos);//url: http://localhost:3000/api/v1/productos

// Crear producto
router.post('/productos', createProducto);//url: http://localhost:3000/api/v1/productos

// Actualizar producto
router.put('/productos/:id', updateProducto);//url: http://localhost:3000/api/v1/productos/:id

// Eliminar producto
router.delete('/productos/:id', deleteProducto);//url: http://localhost:3000/api/v1/productos/:id

module.exports = router;
