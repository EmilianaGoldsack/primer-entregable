import express from 'express';
import productsRouter from './routes/products.js';
import cartsRouter from './routes/carts.js';

const app = express();
const port = 8080;

// Middleware 
app.use(express.json());

// routers
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Manejo de rutas no encontradas
app.use((req, res, next) => {
  res.status(404).send('Ruta no encontrada');
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});

