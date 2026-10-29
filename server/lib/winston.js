// 1. Importando el core de winston
import winston, { format } from 'winston';

// 3. Importando bibliotecas de Node.js
import path from 'node:path';
import fs from 'node:fs';

// 6. Importando plug-in de winston para rotación diaria
import DailyRotateFile from 'winston-daily-rotate-file';

// 12 - 14. Creando variable del directorio raíz y carpeta de logs
const rootdir = path.resolve(process.cwd());
const logsDir = path.join(rootdir, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}
