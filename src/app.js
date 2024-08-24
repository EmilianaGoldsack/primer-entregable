import express from 'express';
import { create } from 'express-handlebars';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './models/db.js';
import productRouter from './routes/products.js';
import cartRouter from './routes/carts.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(fileURLToPath(import.meta.url), '..', 'public'))); // Static files

// Handlebars setup
const exphbs = create({
  defaultLayout: 'main',
  layoutsDir: path.join(fileURLToPath(import.meta.url), '..', 'views', 'layouts'),
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
});
app.engine('handlebars', exphbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(fileURLToPath(import.meta.url), '..', 'views'));

// Routes
app.use('/products', productRouter);
app.use('/api/carts', cartRouter);

// Views
app.get('/', async (req, res) => {
  const Product = (await import('./models/products.model.js')).default;
  try {
    const products = await Product.find();
    res.render('index', { products });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

app.get('/products/:pid', async (req, res) => {
  const Product = (await import('./models/products.model.js')).default;
  try {
    const product = await Product.findById(req.params.pid);
    res.render('productDetails', { product });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

app.get('/carts/:cid', async (req, res) => {
  const Cart = (await import('./models/carts.model.js')).default;
  try {
    const cart = await Cart.findById(req.params.cid).populate('products');
    res.render('cartDetails', { cart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// WebSocket setup
io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle product updates
  socket.on('productUpdate', (product) => {
    io.emit('productUpdate', product);
  });

  // Handle cart updates
  socket.on('cartUpdate', (cart) => {
    io.emit('cartUpdate', cart);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Start server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
