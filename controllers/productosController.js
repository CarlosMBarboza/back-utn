const Producto = require('../models/Productos');
const multer = require('multer');
const shortid = require('shortid');
const path = require('path');
const fs = require('fs');

// Configuración de Multer
const configuracionMulter = {
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(__dirname, '../img/'); // Cambiado a "img"
      
      // Crear directorio si no existe
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const extension = file.mimetype.split('/')[1];
      cb(null, `${shortid.generate()}.${extension}`); // Asegurar punto antes de la extensión
    }
  }),
  fileFilter(req, file, cb) {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(new Error('Formato no válido. Solo se permiten imágenes JPEG y PNG.'));
    }
  }
};

// Inicialización de Multer
const upload = multer(configuracionMulter).single('imagen');


// Controlador para subir un archivo
exports.subirArchivo = (req, res, next) => {
  upload(req, res, (error) => {
    if (error instanceof multer.MulterError) {
      return res.status(500).json({ mensaje: `Error al subir el archivo: ${error.message}` });
    } else if (error) {
      return res.status(400).json({ mensaje: error.message });
    }

    // Verificar si se subió un archivo
    if (!req.file) {
      return res.status(400).json({ mensaje: 'No se subió ningún archivo.' });
    }

    // Pasar el nombre del archivo al siguiente middleware
    req.body.imagen = req.file.filename;
    next();
  });
};

// Agregar producto via POST
exports.nuevoProducto = async (req, res, next) => {
  const producto = new Producto(req.body);

  try {
    // Guardar producto en la base de datos
    await producto.save();
    res.json({ mensaje: 'Producto creado correctamente', producto });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Hubo un error al guardar el producto' });
    next(error);
  }
};

// Obtener productos via GET
exports.mostrarProductos = async (req, res, next) => {
  try {
    const productos = await Producto.find({});
    res.json(productos);
  } catch (error) {
    console.log(error);
    res.json({ mensaje: 'Hubo un error' });
    next(error);
  }
};

// Mostrar un producto por ID
exports.mostrarUnProducto = async (req, res, next) => {
  const { idProducto } = req.params;
  
  try {
    const producto = await Producto.findById(idProducto);
    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    res.json(producto);
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: 'Hubo un error al buscar el producto' });
    next(error);
  }
};

// Actualizar un producto por ID
exports.actualizarProducto = async (req, res, next) => {
  const { idProducto } = req.params;
  const nuevoProducto = req.body;

  try {
    if (req.file) {
      nuevoProducto.imagen = req.file.filename;
    } else {
      let productoAnterior = await Producto.findById(idProducto);
      if (productoAnterior) {
        nuevoProducto.imagen = productoAnterior.imagen;
      }
    }

    let producto = await Producto.findOneAndUpdate({ _id: idProducto }, nuevoProducto, { new: true });
    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    res.json(producto);
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: 'Hubo un error al actualizar el producto' });
    next(error);
  }
};

// Eliminar un producto por ID
exports.eliminarProducto = async (req, res, next) => {
  const { idProducto } = req.params;
  try {
    let producto = await Producto.findById(idProducto);
    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    // Eliminar archivo de imagen asociado
    const filePath = path.join(__dirname, '../../uploads/', producto.imagen);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await Producto.findOneAndDelete({ _id: idProducto });
    res.json({ mensaje: 'Producto eliminado' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: 'Hubo un error al eliminar el producto' });
    next(error);
  }
};
