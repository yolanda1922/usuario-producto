const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
    nombre: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, minlength: 8 },
    password: { type: String, required: true },
},
    { timestamps: true }

);


const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;