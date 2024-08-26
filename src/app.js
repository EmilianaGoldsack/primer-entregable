import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './models/db.js'; // Conexión a la base de datos
import productRouter from './routes/products.js';
import cartRouter from './routes/carts.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Conectar a MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(fileURLToPath(import.meta.url), '..', 'public')));

// Rutas
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);

// WebSocket setup (opcional, si tienes WebSockets implementados)
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Iniciar el servidor
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
