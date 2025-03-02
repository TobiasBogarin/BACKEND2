const UserDAO = require('../dao/UserDAO');

class UserRepository {
  async getUserById(id) {
    return await UserDAO.findById(id);
  }

  async getUserByEmail(email) {
    return await UserDAO.findByEmail(email);
  }

  async createUser(userData) {
    return await UserDAO.create(userData);
  }

  async updateUser(id, userData) {
    return await UserDAO.update(id, userData);
  }

  async deleteUser(id) {
    return await UserDAO.delete(id);
  }

  async existsByEmail(email) {
    return await UserDAO.existsByEmail(email);
  }

  async getUsersByRole(role) {
    return await UserDAO.findByRole(role);
  }
}

module.exports = new UserRepository();