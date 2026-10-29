import createError from 'http-errors';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import createDebug from 'debug';
import hbs from 'hbs';
import indexRouter from '#routes/index.js';
import usersRouter from '#routes/users.js';
import { registerViteHelper } from './lib/vite.js';
import logger from './lib/winston.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const debug = createDebug('dwssr-2026b:server');

debug('Creando backend');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

registerViteHelper(hbs);

// Configurar middlewares de la aplicación
app.use(
  morgan('dev', {
    stream: {
      write: (msg) => logger.info(msg.trim()),
    },
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'dist')));
}

debug('Creando servidor de archivos estáticos');
app.use(express.static(path.join(__dirname, '..', 'public')));

debug('Registrando rutas');
app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, _next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

export default app;
