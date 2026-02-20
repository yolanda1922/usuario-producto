require('dotenv').config();
const cors = require('cors');
const express = require('express');
const connectDB = require('./config/db');
const usuarioRouter = require('./routes/usuarios.routes');
const productoRouter = require('./routes/productos.routes');
const carritoRouter = require('./routes/carrito.routes');

const PORT = process.env.PORT || 3000;

const app = express();

// Conectar a la base de datos
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

app.use('/api/v1', usuarioRouter);
app.use('/api/v1', productoRouter);
app.use('/api/v1', carritoRouter);

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
