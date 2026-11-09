import createError from 'http-errors';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

// Importar rutas de la aplicación
import indexRouter from '#routes/index.js';
import usersRouter from '#routes/users.js';

// Importando la función de configuración de Hbs
import configureHandlebars from './lib/handlebars.js';

// Importando la configuración de winston logger
import logger from './lib/winston.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Crear la aplicación express
logger.info('Creando backend');
const app = express();

// Configurar el motor de vistas con hbs
configureHandlebars(app);

// Configurar middlewares de la aplicación
app.use(morgan('combined', { stream: logger.stream }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

if (process.env.NODE_ENV === 'production') {
  logger.info('Creando servidor de Archivos Estáticos');
  app.use(express.static(path.join(__dirname, '..', 'public')));
}

// Registramos las rutas de la aplicación
logger.info('Registrando rutas');
app.use('/', indexRouter);
app.use('/users', usersRouter);

// Capturamos errores 404 y los enviamos al manejador de errores
app.use((req, res, next) => {
  next(createError(404));
});

// Manejador de errores
app.use((err, req, res, _next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? {
    status: err.status || 500,
    stack: err.stack,
  } : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;