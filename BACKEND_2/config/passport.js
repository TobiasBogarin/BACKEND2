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
}, (email, password, done) => {
  User.findOne({ email })
    .then(user => {
      if (!user) return done(null, false, { message: 'Usuario no encontrado' });
      const isMatch = user.comparePassword(password);
      if (!isMatch) return done(null, false, { message: 'Contraseña incorrecta' });
      return done(null, user);
    })
    .catch(err => done(err));
}));

const cookieExtractor = req => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['jwt'];
  }
  return token;
};

passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
  secretOrKey: JWT_SECRET
}, (jwtPayload, done) => {
  User.findById(jwtPayload.id)
    .then(user => {
      if (user) return done(null, user);
      return done(null, false);
    })
    .catch(err => done(err, false));
}));
