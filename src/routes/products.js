import express from 'express';
import Product from '../models/products.model.js';

const router = express.Router();

// Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products); // Responder con JSON para depurar
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Obtener un producto por ID
router.get('/:pid', async (req, res) => {
  try {
    const product = await Product.findById(req.params.pid);
    if (!product) {
      return res.status(404).json({ status: 'error', message: 'Product not found' });
    }
    res.json(product); // Responder con JSON para depurar
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

export default router;
