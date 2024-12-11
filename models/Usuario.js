const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  token: { type: String }, // Campo opcional para el token de recuperación
});

module.exports = mongoose.model('Usuario', usuarioSchema);

