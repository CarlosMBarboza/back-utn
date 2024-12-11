const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');
const productosController = require('../controllers/productosController');
const pedidosController = require('../controllers/pedidosControllers');
const { usuarioRegister, usuarioLogin, usuarioOlvidePassword } = require('../controllers/usuarioController');
const { authMiddleware, admin } = require('../middleware/authMiddleware');

module.exports = function () {
  // Rutas protegidas
  router.get('/ruta-protegida', authMiddleware, (req, res) => {
    res.json({ message: 'Acceso autorizado', user: req.user });
  });

  // Autenticación
  router.post('/login', usuarioLogin);
  router.post('/register', usuarioRegister);
  router.post('/olvide-password', usuarioOlvidePassword);

  // Clientes
  router.post('/clientes', clienteController.nuevoCliente);
  router.get('/clientes', clienteController.mostrarClientes);
  router.get('/clientes/:idCliente', clienteController.mostrarUnCliente);
  router.put('/clientes/:idCliente', clienteController.actualizarCliente);
  router.delete('/clientes/:idCliente', clienteController.eliminarCliente);

  // Productos
  router.post('/productos', productosController.subirArchivo, productosController.nuevoProducto);
  router.get('/productos', productosController.mostrarProductos);
  router.get('/productos/:idProducto', productosController.mostrarUnProducto);
  router.put('/productos/:idProducto', productosController.subirArchivo, productosController.actualizarProducto);
  router.delete('/productos/:idProducto', productosController.eliminarProducto);

  // Pedidos
  router.post('/pedidos', pedidosController.nuevoPedido);
  router.get('/pedidos', pedidosController.mostrarPedidos);
  router.get('/pedidos/:idPedido', pedidosController.mostrarUnPedido);
  router.put('/pedidos/:idPedido', pedidosController.actualizarPedido);
  router.delete('/pedidos/:idPedido', pedidosController.eliminarPedido);

  return router;
};
