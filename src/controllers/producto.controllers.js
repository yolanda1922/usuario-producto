const Producto = require('../models/producto');

const getProductos = async (req, res) => {
	try {
		const productos = await Producto.find({});
		return res.status(200).json({ productos });
	} catch (error) {
		return res.status(500).json({ message: 'Error al obtener productos', error: error.message });
	}
};

const createProducto = async (req, res) => {
	try {
		const { nombre, precio } = req.body;
		const nuevoProducto = await Producto.create({ nombre, precio });
		return res.status(201).json(nuevoProducto);
	} catch (error) {
		return res.status(500).json({ message: 'Error al crear producto', error: error.message });
	}
};

const updateProducto = async (req, res) => {
	try {
		const { id } = req.params;
		const { nombre, precio } = req.body;
		const productoActualizado = await Producto.findByIdAndUpdate(
			id,
			{ nombre, precio },
			{ new: true, runValidators: true }
		);
		if (!productoActualizado) {
			return res.status(404).json({ message: 'Producto no actualizado' });
		}
		return res.status(200).json({ producto: productoActualizado });
	} catch (error) {
		return res.status(500).json({ message: 'Error al actualizar producto', error: error.message });
	}
};

const deleteProducto = async (req, res) => {
	try {
		const { id } = req.params;
		const deletedProducto = await Producto.findByIdAndDelete(id);
		if (!deletedProducto) {
			return res.status(404).json({ message: 'Producto no encontrado' });
		}
		return res.status(200).json({ message: 'Producto eliminado correctamente' });
	} catch (error) {
		return res.status(500).json({ message: 'Error al eliminar producto', error: error.message });
	}
};

module.exports = {
	getProductos,
	createProducto,
	updateProducto,
	deleteProducto
};
