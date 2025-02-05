
const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;


router.post('/register', async (req, res) => {
  const { first_name, last_name, email, age, password, cart, role } = req.body;
  if (!first_name || !last_name || !email || !age || !password) {
    return res.status(400).json({ message: 'Faltan datos obligatorios' });
  }
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }
    user = new User({ first_name, last_name, email, age, password, cart, role });
    await user.save();
    return res.status(201).json({
      message: 'Usuario creado exitosamente',
      user: {
        id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        age: user.age,
        role: user.role,
        cart: user.cart
      }
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


router.get('/current', (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) return res.status(500).json({ message: err.message });
    if (!user) return res.status(401).json({ message: (info && info.message) ? info.message : 'Token inválido o inexistente' });
    return res.json({
      id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      age: user.age,
      role: user.role,
      cart: user.cart
    });
  })(req, res, next);
});

module.exports = router;
