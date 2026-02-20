const Cart = require('../models/cart');
const Producto = require('../models/producto');

const getCarrito = async (req, res) => {
    try {
        const { usuarioId } = req.params;
        const carrito = await Cart.findOne({ usuario: usuarioId }).populate('items.producto');
        if (!carrito) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }
        return res.status(200).json({ carrito });
    } catch (error) {
        return res.status(500).json({ message: 'Error al obtener carrito', error: error.message });
    }
};

const agregarAlCarrito = async (req, res) => {
    try {
        const { usuarioId, productoId } = req.params;
        const { cantidad } = req.body;

        if (!cantidad || cantidad < 1) {
            return res.status(400).json({ message: 'Cantidad debe ser mayor a 0' });
        }

        const producto = await Producto.findById(productoId);
        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        let carrito = await Cart.findOne({ usuario: usuarioId });
        if (!carrito) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        const itemExistente = carrito.items.find(item => item.producto.toString() === productoId);
        if (itemExistente) {
            itemExistente.cantidad += cantidad;
        } else {
            carrito.items.push({
                producto: productoId,
                cantidad,
                precio: producto.precio
            });
        }

        carrito.total = carrito.items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
        await carrito.save();

        await carrito.populate('items.producto');
        return res.status(200).json({ carrito, message: 'Producto agregado al carrito' });
    } catch (error) {
        return res.status(500).json({ message: 'Error al agregar al carrito', error: error.message });
    }
};

const eliminarDelCarrito = async (req, res) => {
    try {
        const { usuarioId, productoId } = req.params;

        let carrito = await Cart.findOne({ usuario: usuarioId });
        if (!carrito) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        carrito.items = carrito.items.filter(item => item.producto.toString() !== productoId);
        carrito.total = carrito.items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
        await carrito.save();

        await carrito.populate('items.producto');
        return res.status(200).json({ carrito, message: 'Producto eliminado del carrito' });
    } catch (error) {
        return res.status(500).json({ message: 'Error al eliminar del carrito', error: error.message });
    }
};

const actualizarCarrito = async (req, res) => {
    try {
        const { usuarioId, productoId } = req.params;
        const { cantidad } = req.body;

        if (!cantidad || cantidad < 1) {
            return res.status(400).json({ message: 'Cantidad debe ser mayor a 0' });
        }

        let carrito = await Cart.findOne({ usuario: usuarioId });
        if (!carrito) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        const item = carrito.items.find(item => item.producto.toString() === productoId);
        if (!item) {
            return res.status(404).json({ message: 'Producto no está en el carrito' });
        }

        item.cantidad = cantidad;
        carrito.total = carrito.items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
        await carrito.save();

        await carrito.populate('items.producto');
        return res.status(200).json({ carrito, message: 'Carrito actualizado' });
    } catch (error) {
        return res.status(500).json({ message: 'Error al actualizar carrito', error: error.message });
    }
};

const limpiarCarrito = async (req, res) => {
    try {
        const { usuarioId } = req.params;

        let carrito = await Cart.findOne({ usuario: usuarioId });
        if (!carrito) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        carrito.items = [];
        carrito.total = 0;
        await carrito.save();

        return res.status(200).json({ carrito, message: 'Carrito vaciado' });
    } catch (error) {
        return res.status(500).json({ message: 'Error al limpiar carrito', error: error.message });
    }
};

module.exports = {
    getCarrito,
    agregarAlCarrito,
    eliminarDelCarrito,
    actualizarCarrito,
    limpiarCarrito
};
