'use strict'

//cargar el modulo express con una instancia
var express = require('express');

//cargar el UserController, con el fichero de users.js del controlador
var UserController = require('../controllers/user');

//cargar el router expres en una variable para poder cargar rutas
var api = express.Router();

//cargar el middleware
var md_auth = require('../middlewares/authenticated');

//Cargar ruta
api.get('/probando-controlador', md_auth.ensureAuth, UserController.pruebas);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
api.put('/update-user/:id', md_auth.ensureAuth, UserController.updateUser);


// para poder usarlo fuera de este fichero
module.exports = api;