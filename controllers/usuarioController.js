const Usuario = require('../models/Usuario');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Registro de usuario
exports.usuarioRegister = async (req, res) => {
  await check('name').isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres').run(req);
  await check('email').isEmail().withMessage('El correo electrónico no es válido').run(req);
  await check('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres').run(req);
  await check('repetirPassword').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres').run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, email, password, repetirPassword } = req.body;
    if (password !== repetirPassword) {
      return res.status(400).json({ message: 'Las contraseñas no coinciden' });
    }

    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ message: 'El usuario ya está registrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const nuevoUsuario = new Usuario({ name, email, password: hashedPassword });
    await nuevoUsuario.save();

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ message: 'Usuario registrado exitosamente', token });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar el usuario', error: error.message });
  }
};

// Login de usuario
exports.usuarioLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Se requieren correo y contraseña' });
    }

    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const passwordCorrecta = await bcrypt.compare(password, usuario.password);
    if (!passwordCorrecta) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const token = jwt.sign({ email: usuario.email, id: usuario._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      token,
      user: { id: usuario._id, name: usuario.name, email: usuario.email },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
  }
};

// Olvidar contraseña
exports.usuarioOlvidePassword = async (req, res) => {
  try {
    const { email } = req.body;
    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
      return res.status(404).json({ message: 'El usuario no existe' });
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '15m' });
    usuario.token = token;
    await usuario.save();

    res.status(200).json({ message: 'Correo enviado exitosamente', token });
  } catch (error) {
    res.status(500).json({ message: 'Error al enviar el correo', error: error.message });
  }
};


