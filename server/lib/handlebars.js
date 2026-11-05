import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { create as createHbsEngine } from 'express-handlebars';
import { registerViteHelper } from './vite.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default function configureHandlebars(app) {
  const exphbs = createHbsEngine({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, '..', 'views', 'layouts'),
    partialsDir: path.join(__dirname, '..', 'views', 'partials'),
  });

  registerViteHelper(exphbs);

  app.engine('hbs', exphbs.engine);
  app.set('view engine', 'hbs');
  app.set('views', path.join(__dirname, '..', 'views'));
}
