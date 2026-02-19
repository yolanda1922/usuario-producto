const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const registerUsuario = async (req, res) => {
	try {
		const nombre = req.body.nombre || req.body.name;
		const email = (req.body.email || req.body.correo)?.trim();
		const password = req.body.password || req.body.contrasena;

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
		const nuevoUsuario = await Usuario.create({ nombre, email, password: hashedPassword });
		return res.status(201).json({ usuario: nuevoUsuario });
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
		return res.status(500).json({ message: 'Error al iniciar sesion', error: error.message });
	}
};

const verificarUsuario = async (req, res) => {
	try {
		const { id } = req.user;
		const usuarioEncontrado = await Usuario.findById(id).select('-password');
		if (!usuarioEncontrado) {
			return res.status(404).json({ message: 'Usuario no encontrado' });
		}
		return res.status(200).json({
			message: 'Usuario verificado',
			usuario: usuarioEncontrado
		});
	} catch (error) {
		return res.status(500).json({ message: 'Error al verificar usuario', error: error.message });
	}
};

const getUsuarios = async (req, res) => {
	try {
		const usuarios = await Usuario.find({}).select('-password');
		return res.status(200).json({ usuarios });
	} catch (error) {
		return res.status(500).json({ message: 'Error al obtener usuarios', error: error.message });
	}
};

const getPerfilUsuario = async (req, res) => {
	try {
		const { id } = req.params;
		const usuarioEncontrado = await Usuario.findById(id).select('-password');
		if (!usuarioEncontrado) {
			return res.status(404).json({ message: 'Usuario no encontrado' });
		}
		return res.status(200).json({ usuario: usuarioEncontrado });
	} catch (error) {
		return res.status(500).json({ message: 'Error al obtener perfil', error: error.message });
	}
};

const updateUsuario = async (req, res) => {
	try {
		const { id } = req.params;
		const { nombre } = req.body;
		const email = req.body.email?.trim();
		const password = req.body.password;

		const updateData = {};
		if (nombre) updateData.nombre = nombre;
		if (email) updateData.email = email;
		if (password) {
			const salt = await bcryptjs.genSalt(10);
			updateData.password = await bcryptjs.hash(password, salt);
		}

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
		return res.status(500).json({ message: 'Error al actualizar usuario', error: error.message });
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
		return res.status(500).json({ message: 'Error al eliminar usuario', error: error.message });
	}
};

module.exports = {
	registerUsuario,
	loginUsuario,
	verificarUsuario,
	getUsuarios,
	getPerfilUsuario,
	updateUsuario,
	deleteUsuario
};
