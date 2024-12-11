const Pedidos = require('../models/Pedidos');



exports.nuevoPedido = async (req, res, next) => {
  const pedido = new Pedidos(req.body);

  try {
    await pedido.save();
    res.json({mensaje: 'Pedido creado correctamente'});
  } catch (error) {
    console.log(error);
    res.json({mensaje: 'Hubo un error'});
    next(error);
  }
}


exports.mostrarPedidos = async (req, res, next) => {
  try {
    const pedidos = await Pedidos.find({}).populate('cliente').populate({
      path: 'pedido.producto',
      model: 'Productos'
    }); 
    res.json(pedidos);
  } catch (error) {
    console.log(error);
    res.json({mensaje: 'Hubo un error'});
    next(error);
  }
}


exports.mostrarUnPedido = async (req, res, next) => {
  const { idPedido } = req.params;
  const pedido = await Pedidos.findById(idPedido);

  if (!pedido) {
    res.json({mensaje: 'Pedido no encontrado'});
    next(error);
  }

  res.json(pedido);
}


exports.actualizarPedido = async (req, res, next) => {

  const { idPedido } = req.params;
  const nuevoPedido = req.body;

  try {
    let pedido = await Pedidos.findById(idPedido);
    if (!pedido) {
      res.json({mensaje: 'Pedido no encontrado'});
      next(error);
    }
    pedido = await Pedidos.findOneAndUpdate({_id: idPedido}, nuevoPedido, {new: true});
    res.json(pedido);  
  } catch (error) {
    console.log(error);
    res.json({mensaje: 'Hubo un error'});
    next(error);
  }

}


exports.eliminarPedido = async (req, res, next) => {
  const { idPedido } = req.params;

  try {
    let pedido = await Pedidos.findById(idPedido);
    if (!pedido) {
      res.json({mensaje: 'Pedido no encontrado'});
      next(error);
    }
    await Pedidos.findOneAndDelete({_id: idPedido});
    res.json({mensaje: 'Pedido eliminado'});
  } catch (error) {
    console.log(error);
    res.json({mensaje: 'Hubo un error'});
    next(error);
  }
}
