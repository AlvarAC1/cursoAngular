'use strict'

//cargar el modulo express con una instancia
var express = require('express');

//cargar el UserController, con el fichero de users.js del controlador
var UserController = require('../controllers/user');

//cargar el router expres en una variable para poder cargar rutas
var api = express.Router();

//Cargar ruta
api.get('/probando-controlador', UserController.pruebas);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);


// para poder usarlo fuera de este fichero
module.exports = api;