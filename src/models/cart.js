const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
   usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true, unique: true },
   items: [
      {
         producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto', required: true },
         cantidad: { type: Number, required: true, min: 1 },
         precio: { type: Number, required: true, min: 0 }
      }
   ],
   total: { type: Number, default: 0, min: 0 }
},
   { timestamps: true }
);

module.exports = mongoose.model('Cart', cartSchema);
