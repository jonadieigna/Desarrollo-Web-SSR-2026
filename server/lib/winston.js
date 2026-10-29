import winston, { format } from 'winston';
import path from 'node:path';
import fs from 'node:fs';
import DailyRotateFile from 'winston-daily-rotate-file';

// Directorio raíz y creación síncrona de la carpeta de logs
const rootdir = path.resolve(process.cwd());
const logsDir = path.join(rootdir, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Desestructuración de funciones de formato
const { combine, timestamp, label, printf, colorize, uncolorize, json, prettyPrint } = format;

// Formatos personalizados
const myConsoleFormat = combine(
  colorize({ all: true }),
  label({ label: '🌐' }),
  timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
  printf((info) => `${info.level} -> ${info.label} -> [${info.timestamp}] -> ${info.message}`),
);

const myFileFormat = combine(uncolorize(), timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }), json());

// Configuración de Transportes
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

// Instanciación del Logger y Manejadores de Crisis
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

// Exportación del módulo
export default logger;
