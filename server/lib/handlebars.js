import { engine } from 'express-handlebars';
import path from 'node:path';
import { registerViteHelper } from './vite.js';

export default function configureHandlebars(app) {
  app.engine(
    '.hbs',
    engine({
      extname: '.hbs',
      defaultLayout: 'main',
      layoutsDir: path.join(path.resolve(), 'server/views/layouts'),
      partialsDir: path.join(path.resolve(), 'server/views/partials'),
      helpers: {
        viteAssets: registerViteHelper(),
      },
    }),
  );
  app.set('view engine', '.hbs');
  app.set('views', path.join(path.resolve(), 'server/views'));
}