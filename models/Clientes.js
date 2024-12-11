const mongoose = require('mongoose');

const clientesSchema = new mongoose.Schema({
  nombre:{
    type: String,
    trim:true
  },
  apellido:{
    type: String,
    trim:true
  },
  empresa:{
    type: String,
    trim:true
  },
  email:{
    type: String,
    unique: true,
    trim:true,
    lowercase: true
  },
  telefono:{
    type: String,
    trim:true
  }
})

module.exports = mongoose.model('Clientes', clientesSchema);