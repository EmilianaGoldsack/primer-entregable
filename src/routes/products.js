import express from 'express';
import { readJSONFile, writeJSONFile } from '../fileManager.js';

const router = express.Router();
const productsFile = 'src/products.json';

// archivo JSON
let products = readJSONFile(productsFile);
let productIdCounter = products.length > 0 ? Math.max(...products.map(p => p.id)) : 0;

// Lista todos los productos
router.get('/', (req, res) => {
  res.send(products);
});

// Trae el producto con el id proporcionado
router.get('/:pid', (req, res) => {
  const { pid } = req.params;
  const productId = parseInt(pid, 10);
  const product = products.find(p => p.id === productId);
  if (product) {
    res.send(product);
  } else {
    res.status(404).send('Producto no encontrado');
  }
});

// Agrega un nuevo producto
router.post('/', (req, res) => {
  const { title, description, code, price, status, stock, category, thumbnails } = req.body;
  const newProduct = {
    id: ++productIdCounter,
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails
  };
  products.push(newProduct);
  writeJSONFile(productsFile, products);
  res.status(201).send(newProduct);
});

// Actualiza un producto por id
router.put('/:pid', (req, res) => {
  const { pid } = req.params;
  const productId = parseInt(pid, 10);
  const { title, description, code, price, status, stock, category, thumbnails } = req.body;
  const productIndex = products.findIndex(p => p.id === productId);
  if (productIndex !== -1) {
    const updatedProduct = {
      ...products[productIndex],
      title: title || products[productIndex].title,
      description: description || products[productIndex].description,
      code: code || products[productIndex].code,
      price: price || products[productIndex].price,
      status: status || products[productIndex].status,
      stock: stock || products[productIndex].stock,
      category: category || products[productIndex].category,
      thumbnails: thumbnails || products[productIndex].thumbnails
    };
    products[productIndex] = updatedProduct;
    writeJSONFile(productsFile, products);
    res.send(updatedProduct);
  } else {
    res.status(404).send('Producto no encontrado');
  }
});

// Elimina un producto por id
router.delete('/:pid', (req, res) => {
  const { pid } = req.params;
  const productId = parseInt(pid, 10);
  const productIndex = products.findIndex(p => p.id === productId);
  if (productIndex !== -1) {
    products = products.filter(p => p.id !== productId);
    writeJSONFile(productsFile, products);
    res.status(204).send();
  } else {
    res.status(404).send('Producto no encontrado');
  }
});

export default router;