require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const usuario = require('./models/usuario');
const producto = require('./models/producto');

const PORT = process.env.PORT || 3000;

const app = express();

// Conectar a la base de datos
connectDB();

// Middleware
app.use(express.json());

// Rutas
app.get('/productos', async (req, res) => {
    try {
        const productos = await producto.find({});
        return res.status(200).json({ productos });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener productos', error: error.message });
    }
});
app.post('/productos', async (req, res) => {
    try {
        const { nombre, precio } = req.body;
        const nuevoProducto = await producto.create({ nombre, precio });
        return res.status(201).json(nuevoProducto);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear producto', error: error.message });
    }//url: http://localhost:3000/productos 
});

app.put('/productos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, precio } = req.body;
        const productoActualizado = await producto.findByIdAndUpdate(id, { nombre, precio }, { new: true, runValidators: true });
        if (!productoActualizado) {
            return res.status(404).json({ message: 'Producto no actualizado' });
        }
        return res.status(200).json({ producto: productoActualizado });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar producto', error: error.message });
    }
});//url: http://localhost:3000/productos/id

app.delete('/productos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProducto = await producto.findByIdAndDelete(id);
        if (!deletedProducto) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        return res.status(200).json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar producto', error: error.message });
    }
});//url: http://localhost:3000/productos/id


app.get('/usuarios', async (req, res) => {
    try {
        const usuarios = await usuario.find({});
        return res.status(200).json({ usuarios });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener usuarios', error: error.message });
    }
});

app.post('/usuarios/register', async (req, res) => {
    try {
        const { nombre, email, password } = req.body;
        const nuevoUsuario = await usuario.create({ nombre, email, password });
        return res.status(201).json({ usuario: nuevoUsuario });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear usuario', error: error.message });
    }//url: http://localhost:3000/usuarios/register
});

app.post('/usuarios/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const usuarioEncontrado = await usuario.findOne({ email });
        if (!usuarioEncontrado || usuarioEncontrado.password !== password) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }
        return res.status(200).json({ message: 'Login exitoso', usuario: usuarioEncontrado });
    } catch (error) {
        res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
    }
});//url: http://localhost:3000/usuarios/login

app.put('/usuarios/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, email, password } = req.body;
        const usuarioActualizado = await usuario.findByIdAndUpdate(id, { nombre, email, password }, { new: true, runValidators: true });
        if (!usuarioActualizado) {
            return res.status(404).json({ message: 'Usuario no actualizado' });
        }
        return res.status(200).json({ usuario: usuarioActualizado });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar usuario', error: error.message });
    }
});//url: http://localhost:3000/usuarios/id

app.delete('/usuarios/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUsuario = await usuario.findByIdAndDelete(id);
        if (!deletedUsuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        return res.status(200).json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar usuario', error: error.message });
    }
});//url: http://localhost:3000/usuarios/id



// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
