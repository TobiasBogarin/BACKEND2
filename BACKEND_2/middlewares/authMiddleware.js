const passport = require('passport');

/**
 * @param {string[]} roles 
 */
function authorize(roles = []) {
  return [
    passport.authenticate('jwt', { session: false }),

    (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({ message: 'No autorizado: Token inválido o inexistente' });
      }
      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Acceso denegado: Rol insuficiente' });
      }
      next();
    }
  ];
}

module.exports = authorize;