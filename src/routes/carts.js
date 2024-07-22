import express from 'express';
import { readJSONFile, writeJSONFile } from '../fileManager.js';

const router = express.Router();
const cartsFile = 'src/carts.json';

// archivo JSON
let carts = readJSONFile(cartsFile);
let cartIdCounter = carts.length > 0 ? Math.max(...carts.map(c => c.id)) : 0;

// Crea un nuevo carrito
router.post('/', (req, res) => {
  const newCart = {
    id: ++cartIdCounter,
    products: []
  };
  carts.push(newCart);
  writeJSONFile(cartsFile, carts);
  res.status(201).send(newCart);
});

// Lista productos del carrito con el ID cid
router.get('/:cid', (req, res) => {
  const { cid } = req.params;
  const cart = carts.find(c => c.id === parseInt(cid, 10));
  if (cart) {
    res.send(cart.products);
  } else {
    res.status(404).send('Carrito no encontrado');
  }
});

// Agrega producto al carrito con ID cid
router.post('/:cid/product/:pid', (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  const cartIndex = carts.findIndex(c => c.id === parseInt(cid, 10));
  if (cartIndex !== -1) {
    const productToAdd = {
      product: parseInt(pid, 10),
      quantity: parseInt(quantity, 10)
    };

    const existingProductIndex = carts[cartIndex].products.findIndex(p => p.product === parseInt(pid, 10));
    if (existingProductIndex !== -1) {
      // Si el producto ya existe en el carrito, incrementa la cantidad
      carts[cartIndex].products[existingProductIndex].quantity += parseInt(quantity, 10);
    } else {
      // Agregar el producto al carrito
      carts[cartIndex].products.push(productToAdd);
    }

    writeJSONFile(cartsFile, carts);
    // Envia carrito actualizado
    res.status(201).send(carts[cartIndex]);
  } else {
    res.status(404).send('Carrito no encontrado');
  }
});

// ID único para el carrito
const generateCartId = () => {
  const maxId = carts.reduce((max, cart) => (cart.id > max ? cart.id : max), 0);
  return maxId + 1;
};

export default router;