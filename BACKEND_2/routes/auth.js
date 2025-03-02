const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const UserRepository = require('../repositories/UserRepository');
const UserDTO = require('../dto/UserDTO');
const authorize = require('../middlewares/authMiddleware');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;


router.post('/register', async (req, res) => {
  const { first_name, last_name, email, age, password, cart, role } = req.body;
  if (!first_name || !last_name || !email || !age || !password) {
    return res.status(400).json({ message: 'Faltan datos obligatorios' });
  }
  try {
    const exists = await UserRepository.existsByEmail(email);
    if (exists) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }
    const user = await UserRepository.createUser({ first_name, last_name, email, age, password, cart, role });
    const userDTO = new UserDTO(user);
    return res.status(201).json({
      message: 'Usuario creado exitosamente',
      user: userDTO
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});


router.post('/login', (req, res, next) => {
  passport.authenticate('login', { session: false }, (err, user, info) => {
    if (err) return res.status(500).json({ message: err.message });
    if (!user) return res.status(401).json({ message: info.message || 'Credenciales inválidas' });

    const payload = { id: user._id, email: user.email };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    res.cookie('jwt', token, { httpOnly: true, secure: false });
    return res.json({ message: 'Login exitoso' });
  })(req, res, next);
});


router.get('/current', authorize(), async (req, res) => {
  try {
    const user = await UserRepository.getUserById(req.user._id);
    const userDTO = new UserDTO(user);
    return res.json(userDTO);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;