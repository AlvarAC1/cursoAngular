'use strict'

//cargar el modulo express con una instancia
var express = require('express');

//cargar el UserController, con el fichero de users.js del controlador
var UserController = require('../controllers/user');

//cargar el router expres en una variable para poder cargar rutas
var api = express.Router();

//cargar el middleware
var md_auth = require('../middlewares/authenticated');

//subir una imagen de usuario, cargar multiparty (modulo que nos permite subir ficheros)
var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/users'});

//Cargar ruta
api.get('/probando-controlador', md_auth.ensureAuth, UserController.pruebas);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
api.put('/update-user/:id', md_auth.ensureAuth, UserController.updateUser);
api.post('/upload-image-user/:id', [md_auth.ensureAuth, md_upload], UserController.uploadImage);


// para poder usarlo fuera de este fichero
module.exports = api;