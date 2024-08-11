import express from 'express';
import { readJSONFile, writeJSONFile } from '../fileManager.js';

const router = express.Router();
const cartsFile = 'src/carts.json';

// Obtener todos los carritos
router.get('/', (req, res) => {
    const carts = readJSONFile(cartsFile);
    res.json(carts);
});

// Crear un nuevo carrito
router.post('/', (req, res) => {
    const carts = readJSONFile(cartsFile);
    const newCart = {
        id: Date.now(),
        products: []
    };
    carts.push(newCart);
    writeJSONFile(cartsFile, carts);
    res.status(201).json(newCart);
});

// Obtener los productos de un carrito por ID
router.get('/:cid', (req, res) => {
    const carts = readJSONFile(cartsFile);
    const cart = carts.find(c => c.id === parseInt(req.params.cid, 10));

    if (!cart) {
        return res.status(404).send('Carrito no encontrado');
    }

    res.json(cart.products);
});

// Agregar un producto al carrito
router.post('/:cid/product/:pid', (req, res) => {
    const carts = readJSONFile(cartsFile);
    const cart = carts.find(c => c.id === parseInt(req.params.cid, 10));

    if (!cart) {
        return res.status(404).send('Carrito no encontrado');
    }

    const { pid } = req.params;
    const { quantity } = req.body;

    const existingProduct = cart.products.find(p => p.product === parseInt(pid, 10));

    if (existingProduct) {
        existingProduct.quantity += parseInt(quantity, 10);
    } else {
        cart.products.push({ product: parseInt(pid, 10), quantity: parseInt(quantity, 10) });
    }

    writeJSONFile(cartsFile, carts);
    res.status(201).json(cart);
});

export default router;
