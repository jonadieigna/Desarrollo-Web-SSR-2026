// Importar Express
import express from 'express';

// Crear el enrutador
const router = express.Router();

// Variables para llevar el contador
let counter = 0;
const numbers = [];

// Ruta principal
router.get('/', (req, res, _next) => {
  // Incrementar el contador
  counter += 1;

  // Guardar el número actual
  numbers.push(counter);

  // Renderizar la página principal
  res.render('index', {
    title: 'jonathan dieigna',
    counter,
    numbers,
  });
});

// Exportar el enrutador
export default router;
