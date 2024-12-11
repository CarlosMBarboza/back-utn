const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pedidosSchema = new Schema({
  cliente: {
    type: Schema.ObjectId,
    ref: 'Clientes',
  },
  pedidos:[{
    producto:{
      type: Schema.ObjectId,
      ref: 'Productos',
    }
  }],
  total: {
    type: Number,
  }
});

module.exports = mongoose.model('Pedidos', pedidosSchema);