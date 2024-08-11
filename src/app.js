// app.js
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { engine as expressHandlebars } from 'express-handlebars'; // Importa la función `engine`
import http from 'http';
import { Server as SocketIO } from 'socket.io';
import fs from 'fs/promises';

// Ruta y nombre del archivo actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new SocketIO(server);

// Configura handlebars como el motor de plantillas
const hbs = expressHandlebars({
  // Aquí puedes agregar opciones si es necesario
});

app.engine('handlebars', hbs);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Configuración de middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Configura las rutas
import productsRouter from './routes/products.js';
import cartsRouter from './routes/carts.js';

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Ruta para renderizar la vista de productos
app.get('/products', async (req, res) => {
  try {
    const products = JSON.parse(await fs.readFile(path.join(__dirname, 'products.json')));
    res.render('index', { products });
  } catch (error) {
    res.status(500).send('Error al leer los productos');
  }
});

// Ruta para renderizar la vista en tiempo real de productos
app.get('/realtimeproducts', async (req, res) => {
  try {
    const products = JSON.parse(await fs.readFile(path.join(__dirname, 'products.json')));
    res.render('realTimeProducts', { products });
  } catch (error) {
    res.status(500).send('Error al leer los productos');
  }
});

// Socket.io logica
io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');

  // Maneja el evento de agregar un nuevo producto
  socket.on('new-product', async (product) => {
    try {
      const data = await fs.readFile(path.join(__dirname, 'products.json'));
      const products = JSON.parse(data);

      const productIdCounter = products.length > 0 ? Math.max(...products.map(p => p.id)) : 0;
      const newProduct = {
        id: productIdCounter + 1,
        ...product
      };
      products.push(newProduct);
      await fs.writeFile(path.join(__dirname, 'products.json'), JSON.stringify(products, null, 2));

      io.emit('update-products', newProduct);
    } catch (error) {
      console.error('Error al agregar un producto', error);
    }
  });

  // Maneja el evento de eliminar un producto
  socket.on('delete-product', async (productId) => {
    try {
      const data = await fs.readFile(path.join(__dirname, 'products.json'));
      const products = JSON.parse(data);
      const updatedProducts = products.filter(p => p.id !== parseInt(productId, 10));
      await fs.writeFile(path.join(__dirname, 'products.json'), JSON.stringify(updatedProducts, null, 2));

      io.emit('remove-product', productId);
    } catch (error) {
      console.error('Error al eliminar un producto', error);
    }
  });
});

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});


