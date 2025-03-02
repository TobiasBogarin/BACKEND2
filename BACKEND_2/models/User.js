const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SALT_ROUNDS = 12; 

const UserSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name:  { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true, 
    trim: true,    
    match: [/^\S+@\S+\.\S+$/, 'Por favor, ingresa un email válido'] 
  },
  age:        { type: Number, required: true, min: 0 },
  password:   { type: String, required: true },
  cart:       { type: mongoose.Schema.Types.ObjectId, ref: 'Carts' },
  role:       { type: String, enum: ['user', 'admin', 'premium'], default: 'user' } 
}, {
  timestamps: true 
});

UserSchema.index({ email: 1 });

UserSchema.pre('save', function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = bcrypt.genSaltSync(SALT_ROUNDS);
    this.password = bcrypt.hashSync(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

UserSchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compareSync(candidatePassword, this.password);
};

UserSchema.methods.generateJWT = function() {
  const payload = {
    id: this._id,
    email: this.email,
    role: this.role
  };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};

module.exports = mongoose.model('User', UserSchema);