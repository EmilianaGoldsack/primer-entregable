import express from 'express';
import Product from '../models/products.model.js';

const router = express.Router();

// GET /api/products
router.get('/', async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    // Construir el filtro de búsqueda para el parámetro query
    const searchQuery = {};

    if (query) {
      // Asegurarse de que query es un array
      const queries = Array.isArray(query) ? query : [query];
      queries.forEach(q => {
        const queryParams = q.split(':');
        if (queryParams.length === 2) {
          const field = queryParams[0].trim();
          const value = queryParams[1].trim();
          if (field === 'category') {
            searchQuery.category = value;
          } else if (field === 'stock') {
            searchQuery.stock = parseInt(value, 10);
          }
        }
      });
    }

    // Construir las opciones de paginación
    const options = {
      limit: parseInt(limit),
      page: parseInt(page),
      sort: sort ? { price: sort === 'asc' ? 1 : -1 } : undefined,
    };

    // Buscar productos con paginación y filtrado
    const products = await Product.find(searchQuery)
      .sort(options.sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
    const totalCount = await Product.countDocuments(searchQuery);
    const totalPages = Math.ceil(totalCount / limit);

    // Construir la respuesta
    res.json({
      status: 'success',
      payload: products,
      totalPages: totalPages,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
      page: page,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      prevLink: page > 1 ? `/api/products?limit=${limit}&page=${page - 1}&sort=${sort}&query=${queries.join('&query=')}` : null,
      nextLink: page < totalPages ? `/api/products?limit=${limit}&page=${page + 1}&sort=${sort}&query=${queries.join('&query=')}` : null,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

export default router;