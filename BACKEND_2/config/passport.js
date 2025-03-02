const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET;

passport.use('login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  session: false
}, async (email, password, done) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return done(null, false, { message: 'Usuario no encontrado' });
    }
    const isMatch = user.comparePassword(password);
    if (!isMatch) {
      return done(null, false, { message: 'Contraseña incorrecta' });
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['jwt'];
  }
  return token;
};

passport.use('jwt', new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
  secretOrKey: JWT_SECRET
}, async (jwtPayload, done) => {
  try {
    if (!jwtPayload.id) {
      return done(null, false, { message: 'Token JWT inválido' });
    }
    const user = await User.findById(jwtPayload.id);
    if (!user) {
      return done(null, false, { message: 'Usuario no encontrado' });
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

module.exports = passport;