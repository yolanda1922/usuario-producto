require('dotenv').config();
const cors = require('cors');
const express = require('express');
const connectDB = require('./config/db');
const usuarioRouter = require('./routes/usuarios.routes');
const productoRouter = require('./routes/productos.routes');


const PORT = process.env.PORT || 3000;

const app = express();

// Conectar a la base de datos
connectDB();

// Middleware
//const whitelist = ['http://localhost:3000', 'http://localhost:5173'];

app.use(cors()); //Asi permite peticiones de cualquier dominio
app.use(express.json());

app.use('/api/v1', usuarioRouter);//url: http://localhost:3000/api/v1/usuarios/register
app.use('/api/v1', productoRouter);//url: http://localhost:3000/api/v1/productos

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
