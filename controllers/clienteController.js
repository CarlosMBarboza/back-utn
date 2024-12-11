const Clientes = require('../models/Clientes');




//Agregar cliente via POST
exports.nuevoCliente = async (req, res, next) => {
  const cliente = new Clientes(req.body);

  try {
    await cliente.save();
    res.json({mensaje: 'Se agrego un nuevo cliente corectamente'});
  } catch (error) {
    console.log(error);
    res.send(error);
    next();
  }
}

//Obtener clientes via GET
exports.mostrarClientes = async (req, res, next) => {
  try {
    const clientes = await Clientes.find({});
    res.json(clientes);
  } catch (error) {
    console.log(error);
    res.json({mensaje: 'Hubo un error'});
    next(error);
  }
}

//Mostrar un cliente por ID
exports.mostrarUnCliente = async (req, res, next) => {
  const { idCliente } = req.params;
  const cliente = await Clientes.findById(idCliente);

  if (!cliente) {
    res.json({mensaje: 'Cliente no encontrado'});
    next(error);
  }

  res.json(cliente);
}


//Actualizar un cliente por ID
exports.actualizarCliente = async (req, res, next) => {
  const { idCliente } = req.params;
  const nuevoCliente = req.body;
  try {
    let cliente = await Clientes.findById(idCliente);
    if (!cliente) {
      res.send({mensaje: 'Cliente no encontrado'});
      next();
    }
    cliente = await Clientes.findOneAndUpdate({_id: idCliente}, nuevoCliente, {new: true});
    res.json(cliente);
  } catch (error) {
    console.log(error);
    res.send(error);
    next();
  }
}


//Eliminar un cliente por ID
exports.eliminarCliente = async (req, res, next) => {
  const { idCliente } = req.params;
  try {
    let cliente = await Clientes.findById(idCliente);
    if (!cliente) {
      res.json({mensaje: 'Cliente no encontrado'});
      next(error);
    }
    await Clientes.findOneAndDelete({_id: idCliente});
    res.json({mensaje: 'Cliente eliminado'});
  } catch (error) {
    console.log(error);
    res.json({mensaje: 'Hubo un error'});
    next(error);
  }
}