const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB conectado a la base de datos');
    } catch (error) {
        console.error('No se pudo conectar a la base de datos:', error.message);
        process.exit(1);
    }   
};

module.exports = connectDB;