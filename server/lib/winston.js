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
// Desestructuración de funciones útiles de format
const { combine, timestamp, label, printf, colorize, uncolorize, json, prettyPrint } = format;

// Formato personalizado para la Consola
const myConsoleFormat = combine(
  colorize({ all: true }),
  label({ label: '🌐' }),
  timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
  printf((info) => `${info.level} -> ${info.label} -> [${info.timestamp}] -> ${info.message}`),
);

// Formato personalizado para Archivos (JSON y sin colorización)
const myFileFormat = combine(uncolorize(), timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }), json());

// 11 al 15: Configuración de Transportes dentro del objeto 'options'
const options = {
  errorFile: {
    level: 'error',
    filename: path.join(logsDir, 'error.log'),
    maxsize: 5242880, // 5MB
    maxFiles: 2,
    format: myFileFormat,
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    format: myConsoleFormat,
  },
  readableFile: {
    level: 'info',
    filename: path.join(logsDir, 'readable.log'),
    maxsize: 5242880, // 5MB
    maxFiles: 2,
    format: combine(uncolorize(), timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }), prettyPrint()),
  },
  dailyRotateFile: {
    level: 'info',
    filename: path.join(logsDir, 'app-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxsize: 5242880, // 5MB
    maxFiles: 2,
    format: myFileFormat,
  },
};

// 16 al 20: Instanciación oficial del Logger y Manejadores de Crisis
const logger = winston.createLogger({
  transports: [
    new DailyRotateFile(options.dailyRotateFile),
    new winston.transports.File(options.readableFile),
    new winston.transports.File(options.errorFile),
    new winston.transports.Console(options.console),
  ],
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(logsDir, 'exceptions.log'),
    }),
  ],
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(logsDir, 'rejections.log'),
    }),
  ],
  exitOnError: false,
});

// 21 y 22: Exportación del módulo
export default logger;
