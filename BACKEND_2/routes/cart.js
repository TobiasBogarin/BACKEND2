const express = require('express');
const router = express.Router();
const authorize = require('../middlewares/authMiddleware');
const ProductRepository = require('../repositories/ProductRepository');
const TicketRepository = require('../repositories/TicketRepository');


router.get('/products', authorize(['user']), async (req, res) => {
  try {
    const products = await ProductRepository.getAllProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener productos', error: error.message });
  }
});


router.post('/purchase', authorize(['user']), async (req, res) => {
  const cart = req.body.cart; 
  const purchaser = req.user.email;

  try {
    for (const item of cart) {
      const product = await ProductRepository.getProductById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Producto con ID ${item.productId} no encontrado` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Stock insuficiente para ${product.name}` });
      }
    }

    let amount = 0;
    for (const item of cart) {
      const product = await ProductRepository.getProductById(item.productId);
      amount += product.price * item.quantity;
    }

    const ticketData = { amount, purchaser };
    const ticket = await TicketRepository.createTicket(ticketData);

    for (const item of cart) {
      const product = await ProductRepository.getProductById(item.productId);
      product.stock -= item.quantity;
      await ProductRepository.updateProduct(product._id, { stock: product.stock });
    }

    res.status(201).json({
      message: 'Compra realizada con éxito',
      ticket
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al procesar la compra', error: error.message });
  }
});

module.exports = router;