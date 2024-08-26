import express from 'express';
import Cart from '../models/carts.model.js';
import Product from '../models/products.model.js';

const router = express.Router();

// DELETE /api/carts/:cid/products/:pid
router.delete('/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: 'error', message: 'Cart not found' });

    cart.products = cart.products.filter(item => item.product.toString() !== pid);
    await cart.save();

    res.json({ status: 'success', message: 'Product removed from cart' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// PUT /api/carts/:cid
router.put('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const newProducts = req.body.products; // Expected format: [{ product: productId, quantity: quantity }, ...]

    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: 'error', message: 'Cart not found' });

    cart.products = newProducts;
    await cart.save();

    res.json({ status: 'success', message: 'Cart updated' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// PUT /api/carts/:cid/products/:pid
router.put('/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: 'error', message: 'Cart not found' });

    const productIndex = cart.products.findIndex(item => item.product.toString() === pid);
    if (productIndex === -1) return res.status(404).json({ status: 'error', message: 'Product not found in cart' });

    cart.products[productIndex].quantity = quantity;
    await cart.save();

    res.json({ status: 'success', message: 'Product quantity updated' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// DELETE /api/carts/:cid
router.delete('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;

    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: 'error', message: 'Cart not found' });

    cart.products = [];
    await cart.save();

    res.json({ status: 'success', message: 'All products removed from cart' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// GET /api/carts/:cid
router.get('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;

    const cart = await Cart.findById(cid).populate('products.product');
    if (!cart) return res.status(404).json({ status: 'error', message: 'Cart not found' });

    res.json({ status: 'success', payload: cart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});
// POST /api/carts
router.post('/', async (req, res) => {
    try {
      const newCart = await Cart.create({}); // Crea un carrito vacío
      res.status(201).json(newCart);
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  });

// POST /api/carts/:cid/products/:pid
router.post('/:cid/products/:pid', async (req, res) => {
    try {
      const { cid, pid } = req.params;
      const { quantity } = req.body;
  
      // Validar la cantidad
      if (quantity <= 0) {
        return res.status(400).json({ status: 'error', message: 'Quantity must be greater than 0' });
      }
  
      // Buscar el carrito
      const cart = await Cart.findById(cid);
      if (!cart) {
        return res.status(404).json({ status: 'error', message: 'Cart not found' });
      }
  
      // Buscar el producto
      const product = await Product.findById(pid);
      if (!product) {
        return res.status(404).json({ status: 'error', message: 'Product not found' });
      }
  
      // Verificar si el producto ya está en el carrito
      const productIndex = cart.products.findIndex(p => p.product.toString() === pid);
      if (productIndex > -1) {
        // Si el producto ya está en el carrito, actualizar la cantidad
        cart.products[productIndex].quantity += quantity;
      } else {
        // Si el producto no está en el carrito, agregarlo
        cart.products.push({ product: pid, quantity });
      }
  
      // Guardar el carrito actualizado
      await cart.save();
  
      res.status(200).json({ status: 'success', message: 'Product added to cart', cart });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  });

  // GET /api/carts/:cid/products/:pid
router.get('/:cid/products/:pid', async (req, res) => {
    try {
      const { cid, pid } = req.params;
  
      // Buscar el carrito
      const cart = await Cart.findById(cid).populate('products.product');
      if (!cart) {
        return res.status(404).json({ status: 'error', message: 'Cart not found' });
      }
  
      // Buscar el producto en el carrito
      const cartProduct = cart.products.find(p => p.product._id.toString() === pid);
      if (!cartProduct) {
        return res.status(404).json({ status: 'error', message: 'Product not found in cart' });
      }
  
      res.status(200).json({ status: 'success', product: cartProduct });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  });
export default router;

