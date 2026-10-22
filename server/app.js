// Manejo de errores de la aplicación
import createError from 'http-errors';

// Framework Express
import express from 'express';

// Manejo de rutas y directorios
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Middlewares
import cookieParser from 'cookie-parser';
import logger from 'morgan';

// Herramienta de depuración
import createDebug from 'debug';

// Motor de plantillas Handlebars
import hbs from 'hbs';

// Rutas de la aplicación
import indexRouter from '#routes/index.js';
import usersRouter from '#routes/users.js';

// Helper para integrar Vite
import { registerViteHelper } from './lib/vite.js';

// Configuración de directorios
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de Debug
const debug = createDebug('dwssr-2026b:server');

// Crear la aplicación Express
debug('Creando backend');

const app = express();

// Configurar el motor de vistas
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Registrar el helper de Vite
registerViteHelper(hbs);

// Configurar middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Archivos estáticos de producción
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'dist')));
}

// Archivos estáticos públicos
debug('Creando servidor de archivos estáticos');

app.use(express.static(path.join(__dirname, '..', 'public')));

// Registrar las rutas
debug('Registrando rutas');

app.use('/', indexRouter);
app.use('/users', usersRouter);

// Manejar errores 404
app.use((req, res, next) => {
  next(createError(404));
});

// Manejador centralizado de errores
app.use((err, req, res, _next) => {
  res.locals.message = err.message;

  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);

  res.render('error');
});

// Exportar la aplicación
export default app;
