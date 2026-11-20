// Importando modulos de express
import express from 'express';

import getUsers from './users.controller.js';

// Creando un enrutador de express
const usersRouter = express.Router();

// Enrutando GET "/users"
usersRouter.get('/', getUsers);

export default usersRouter;