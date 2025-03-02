const Ticket = require('../models/Ticket');

class TicketDAO {
  async create(ticketData) {
    const ticket = new Ticket(ticketData);
    return await ticket.save();
  }

  async findById(id) {
    return await Ticket.findById(id);
  }

  async findByPurchaser(email) {
    return await Ticket.find({ purchaser: email });
  }
}

module.exports = new TicketDAO();