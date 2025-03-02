const ProductDAO = require('../dao/ProductDAO');

class ProductRepository {
  async getProductById(id) {
    return await ProductDAO.findById(id);
  }

  async updateProduct(id, productData) {
    return await ProductDAO.update(id, productData);
  }

  async getAllProducts() {
    return await ProductDAO.findAll();
  }
}

module.exports = new ProductRepository();