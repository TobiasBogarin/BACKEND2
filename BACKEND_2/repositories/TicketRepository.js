const TicketDAO = require('../dao/TicketDAO');

class TicketRepository {
  async createTicket(ticketData) {
    return await TicketDAO.create(ticketData);
  }

  async getTicketById(id) {
    return await TicketDAO.findById(id);
  }

  async getTicketsByPurchaser(email) {
    return await TicketDAO.findByPurchaser(email);
  }
}

module.exports = new TicketRepository();