import express from 'express';
import Cart from '../models/carts.model.js';

const router = express.Router();

router.delete('/:cid/products/:pid', async (req, res) => {
  try {
    await Cart.findByIdAndUpdate(req.params.cid, { $pull: { products: { _id: req.params.pid } } });
    res.status(200).json({ status: 'success', message: 'Product removed from cart' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.put('/:cid', async (req, res) => {
  try {
    const { products } = req.body;
    await Cart.findByIdAndUpdate(req.params.cid, { products });
    res.status(200).json({ status: 'success', message: 'Cart updated' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.put('/:cid/products/:pid', async (req, res) => {
  try {
    const { quantity } = req.body;
    await Cart.updateOne({ _id: req.params.cid, 'products._id': req.params.pid }, { $set: { 'products.$.quantity': quantity } });
    res.status(200).json({ status: 'success', message: 'Product quantity updated' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.delete('/:cid', async (req, res) => {
  try {
    await Cart.findByIdAndUpdate(req.params.cid, { $set: { products: [] } });
    res.status(200).json({ status: 'success', message: 'All products removed from cart' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

export default router;
