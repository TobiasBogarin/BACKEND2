const User = require('../models/User');

class UserDAO {
  /**
   * @param {string} id 
   * @returns {Promise<User>}
   */
  async findById(id) {
    return await User.findById(id);
  }

  /**
   * @param {string} email 
   * @returns {Promise<User>} 
   */
  async findByEmail(email) {
    return await User.findOne({ email });
  }

  /**
   * @param {Object} userData 
   * @returns {Promise<User>}
   */
  async create(userData) {
    const user = new User(userData);
    return await user.save();
  }

  /**
   * @param {string} id 
   * @param {Object} userData 
   * @returns {Promise<User>} 
   */
  async update(id, userData) {
    return await User.findByIdAndUpdate(id, userData, { new: true });
  }

  /**
   * @param {string} id 
   * @returns {Promise<User>} 
   */
  async delete(id) {
    return await User.findByIdAndDelete(id);
  }

  /**
   * @returns {Promise<User[]>} 
   */
  async findAll() {
    return await User.find();
  }

  /**
   * @param {string} email 
   * @returns {Promise<boolean>} 
   */
  async existsByEmail(email) {
    const user = await User.findOne({ email });
    return !!user;
  }

  /**
   * @param {string} role 
   * @returns {Promise<User[]>} 
   */
  async findByRole(role) {
    return await User.find({ role });
  }
}

module.exports = new UserDAO();