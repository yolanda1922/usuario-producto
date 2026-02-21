const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');
const Cart = require('../models/cart');

const registerUsuario = async (req, res) => {
	try {
		const nombre = req.body.nombre || req.body.name;
		const email = (req.body.email || req.body.correo)?.trim();
		const password = req.body.password || req.body.contrasena;
		const pais = req.body.pais;
		const direccion = req.body.direccion;
		const codigoPostal = req.body.codigoPostal;

		const missingFields = [];
		if (!nombre) missingFields.push('nombre');
		if (!email) missingFields.push('email');
		if (!password) missingFields.push('password');
		if (missingFields.length > 0) {
			return res.status(400).json({
				message: 'Campos requeridos faltantes',
				missing: missingFields
			});
		}

		const foundUsuario = await Usuario.findOne({ email });
		if (foundUsuario) {
			return res.status(400).json({ message: 'El email ya esta registrado' });
		}

		const salt = await bcryptjs.genSalt(10);
		const hashedPassword = await bcryptjs.hash(password, salt);
		
		// Crear usuario primero
		const nuevoUsuario = await Usuario.create({ 
			nombre, 
			email, 
			password: hashedPassword,
			pais,
			direccion,
			codigoPostal
		});
		
		// Luego crear carrito vinculado al usuario
		const nuevoCart = await Cart.create({ usuario: nuevoUsuario._id, items: [], total: 0 });
		
		// Actualizar usuario con referencia al carrito
		nuevoUsuario.cart = nuevoCart._id;
		await nuevoUsuario.save();
		
		return res.status(201).json({ 
			usuario: nuevoUsuario,
			carrito: nuevoCart
		});
	} catch (error) {
		return res.status(500).json({ message: 'Error al crear usuario', error: error.message });
	}
};

const loginUsuario = async (req, res) => {
	try {
		const email = req.body.email?.trim();
		const password = req.body.password?.trim();

		if (!email || !password) {
			return res.status(400).json({ message: 'Email y password son requeridos' });
		}

		const foundUsuario = await Usuario.findOne({ email });
		if (!foundUsuario) {
			return res.status(401).json({ message: 'El usuario no existe' });
		}

		const correctPassword = await bcryptjs.compare(password, foundUsuario.password);
		if (!correctPassword) {
			return res.status(401).json({ message: 'Email o contrasena incorrecta' });
		}

		const payload = {
			usuario: {
				id: foundUsuario._id
			}
		};

		const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
		
		// Establecer cookie con el token
		res.cookie('token', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: 3600000 // 1 hora en milisegundos
		});
		
		return res.status(200).json({
			token,
			message: 'Login exitoso',
			usuario: {
				id: foundUsuario._id,
				nombre: foundUsuario.nombre,
				email: foundUsuario.email
			}
		});
	} catch (error) {
		const isProd = process.env.NODE_ENV === 'production';
		const errorMessage = isProd ? 'Error al iniciar sesion' : `Error al iniciar sesion: ${error.message}`;
		return res.status(500).json({ message: errorMessage });
	}
};

const verificarUsuario = async (req, res) => {
	try {
		const { id } = req.user;
		const usuarioEncontrado = await Usuario.findById(id)
			.select('-password')
			.populate({
				path: 'cart',
				populate: {
					path: 'items.producto'
				}
			});
		if (!usuarioEncontrado) {
			return res.status(404).json({ message: 'Usuario no encontrado' });
		}
		return res.status(200).json({
			message: 'Usuario verificado',
			usuario: usuarioEncontrado
		});
	} catch (error) {
		const isProd = process.env.NODE_ENV === 'production';
		const errorMessage = isProd ? 'Error al verificar usuario' : `Error al verificar usuario: ${error.message}`;
		return res.status(500).json({ message: errorMessage });
	}
};

const getUsuarios = async (req, res) => {
	try {
		const usuarios = await Usuario.find({})
			.select('-password')
			.populate({
				path: 'cart',
				populate: {
					path: 'items.producto'
				}
			});
		return res.status(200).json({ usuarios });
	} catch (error) {
		const isProd = process.env.NODE_ENV === 'production';
		const errorMessage = isProd ? 'Error al obtener usuarios' : `Error al obtener usuarios: ${error.message}`;
		return res.status(500).json({ message: errorMessage });
	}
};

const getPerfilUsuario = async (req, res) => {
	try {
		const { id } = req.params;
		const usuarioEncontrado = await Usuario.findById(id)
			.select('-password')
			.populate({
				path: 'cart',
				populate: {
					path: 'items.producto'
				}
			});
		if (!usuarioEncontrado) {
			return res.status(404).json({ message: 'Usuario no encontrado' });
		}
		return res.status(200).json({ usuario: usuarioEncontrado });
	} catch (error) {
		const isProd = process.env.NODE_ENV === 'production';
		const errorMessage = isProd ? 'Error al obtener perfil' : `Error al obtener perfil: ${error.message}`;
		return res.status(500).json({ message: errorMessage });
	}
};

const updateUsuario = async (req, res) => {
	try {
		const { id } = req.params;
		const { nombre } = req.body;
		const email = req.body.email?.trim();
		const password = req.body.password;
		const pais = req.body.pais;
		const direccion = req.body.direccion;
		const codigoPostal = req.body.codigoPostal;

		const updateData = {};
		if (nombre) updateData.nombre = nombre;
		if (email) updateData.email = email;
		if (password) {
			const salt = await bcryptjs.genSalt(10);
			updateData.password = await bcryptjs.hash(password, salt);
		}
		if (pais) updateData.pais = pais;
		if (direccion) updateData.direccion = direccion;
		if (codigoPostal) updateData.codigoPostal = codigoPostal;

		const usuarioActualizado = await Usuario.findByIdAndUpdate(
			id,
			updateData,
			{ new: true, runValidators: true }
		).select('-password');

		if (!usuarioActualizado) {
			return res.status(404).json({ message: 'Usuario no actualizado' });
		}
		return res.status(200).json({ usuario: usuarioActualizado });
	} catch (error) {
		const isProd = process.env.NODE_ENV === 'production';
		const errorMessage = isProd ? 'Error al actualizar usuario' : `Error al actualizar usuario: ${error.message}`;
		return res.status(500).json({ message: errorMessage });
	}
};

const logoutUsuario = async (req, res) => {
	try {
		// Limpiar la cookie del token
		res.clearCookie('token');
		return res.status(200).json({ message: 'Sesion cerrada correctamente' });
	} catch (error) {
		const isProd = process.env.NODE_ENV === 'production';
		const errorMessage = isProd ? 'Error al cerrar sesion' : `Error al cerrar sesion: ${error.message}`;
		return res.status(500).json({ message: errorMessage });
	}
};

const deleteUsuario = async (req, res) => {
	try {
		const { id } = req.params;
		const deletedUsuario = await Usuario.findByIdAndDelete(id);
		if (!deletedUsuario) {
			return res.status(404).json({ message: 'Usuario no encontrado' });
		}
		return res.status(200).json({ message: 'Usuario eliminado correctamente' });
	} catch (error) {
		const isProd = process.env.NODE_ENV === 'production';
		const errorMessage = isProd ? 'Error al eliminar usuario' : `Error al eliminar usuario: ${error.message}`;
		return res.status(500).json({ message: errorMessage });
	}
};

module.exports = {
	registerUsuario,
	loginUsuario,
	verificarUsuario,
	getUsuarios,
	getPerfilUsuario,
	updateUsuario,
	logoutUsuario,
	deleteUsuario
};
