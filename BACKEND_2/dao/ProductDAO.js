const Product = require('../models/Product');

class ProductDAO {
  async findById(id) {
    return await Product.findById(id);
  }

  async update(id, productData) {
    return await Product.findByIdAndUpdate(id, productData, { new: true });
  }

  async findAll() {
    return await Product.find();
  }
}

module.exports = new ProductDAO();