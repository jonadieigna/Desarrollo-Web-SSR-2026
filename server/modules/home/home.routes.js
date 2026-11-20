// Importando modulos de express
import express from 'express';

// Importando la accion que quiero enrutar
import renderHome from './home.controller.js';

// Creando un enrutador de express
const homeRouter = express.Router();

// Enrutando Action Methods del controlador Home

// GET "/"
homeRouter.get('/', renderHome);

export default homeRouter;