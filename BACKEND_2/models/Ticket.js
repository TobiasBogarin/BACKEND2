const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
  code: {
    type: String,
    unique: true,
    required: true,
    default: () => `TICKET-${Date.now()}-${Math.random().toString(36).substring(2, 7)}` 
  },
  purchase_datetime: {
    type: Date,
    default: Date.now,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0 
  },
  purchaser: {
    type: String,
    required: true
  }
}, {
  timestamps: true 
});

module.exports = mongoose.model('Ticket', TicketSchema);