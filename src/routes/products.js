// src/routes/products.js
import express from 'express';
import fs from 'fs/promises';
import path from 'path';

// Obtén el nombre del archivo actual y la carpeta del archivo
const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

const router = express.Router();
const productsFile = path.join(__dirname, '../products.json');

// Lee el archivo JSON de productos
async function readProductsFile() {
  try {
    const data = await fs.readFile(productsFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error al leer el archivo de productos', error);
    return [];
  }
}

// Guarda los productos en el archivo JSON
async function writeProductsFile(products) {
  try {
    await fs.writeFile(productsFile, JSON.stringify(products, null, 2));
  } catch (error) {
    console.error('Error al guardar el archivo de productos', error);
  }
}

// Obtiene todos los productos
router.get('/', async (req, res) => {
  const products = await readProductsFile();
  res.json(products);
});

// Obtiene un producto por ID
router.get('/:pid', async (req, res) => {
  const { pid } = req.params;
  const productId = parseInt(pid, 10);
  const products = await readProductsFile();
  const product = products.find(p => p.id === productId);
  if (product) {
    res.json(product);
  } else {
    res.status(404).send('Producto no encontrado');
  }
});

// Crea un nuevo producto
router.post('/', async (req, res) => {
  const { title, description, code, price, status, stock, category } = req.body;
  const products = await readProductsFile();
  const productIdCounter = products.length > 0 ? Math.max(...products.map(p => p.id)) : 0;
  const newProduct = {
    id: productIdCounter + 1,
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails: [] // No se requiere thumbnails al crear producto
  };
  products.push(newProduct);
  await writeProductsFile(products);
  res.status(201).json(newProduct);
});

// Actualiza un producto existente por ID
router.put('/:pid', async (req, res) => {
  const { pid } = req.params;
  const productId = parseInt(pid, 10);
  const { title, description, code, price, status, stock, category } = req.body;
  const products = await readProductsFile();
  const productIndex = products.findIndex(p => p.id === productId);
  if (productIndex !== -1) {
    const updatedProduct = {
      ...products[productIndex],
      title,
      description,
      code,
      price,
      status,
      stock,
      category
    };
    products[productIndex] = updatedProduct;
    await writeProductsFile(products);
    res.json(updatedProduct);
  } else {
    res.status(404).send('Producto no encontrado');
  }
});

// Elimina un producto por ID
router.delete('/:pid', async (req, res) => {
  const { pid } = req.params;
  const productId = parseInt(pid, 10);
  const products = await readProductsFile();
  const productIndex = products.findIndex(p => p.id === productId);
  if (productIndex !== -1) {
    const removedProduct = products.splice(productIndex, 1);
    await writeProductsFile(products);
    res.json(removedProduct[0]);
  } else {
    res.status(404).send('Producto no encontrado');
  }
});

export default router;
