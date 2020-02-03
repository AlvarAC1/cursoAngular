'use strict'

var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var jwt = require('../services/jwt');


function pruebas(req, res){
	res.status(200).send({
		message: 'Probando una acción del controlador de usuarios del api rest con Node y Mongo'
	});
}

function saveUser(req, res){
	var user = new User();

	//datos que nos llegan por petición post
	var params = req.body;

	console.log(params);

	user.name = params.name;
	user.surname = params.surname;
	user.email = params.email;
	user.role = 'ROLE_ADMIN';
	user.image = 'null';

	if(params.password){
		// Encriptar contraseña y guardar datos
		bcrypt.hash(params.password, null, null, function(err, hash){
			user.password = hash;

			if(user.name != null && user.surname != null && user.email != null){
				// Guardar el usuario
				user.save((err, userStored) =>{
					if(err){
						res.status(500).send({message: 'Error al guardar usuario'});
					}else{
						if(!userStored){
							res.status(404).send({message: 'No se ha registrado el usuario'});
						}else{ // si todo va correcto nos devuelve un objeto con propiedad user con los datos
							res.status(500).send({user: userStored});
						}
					}
				});

			}else{
				res.status(200).send({message: 'Rellena todos los campos'});		
			}

		});
	}else{
		res.status(200).send({message: 'Introduce la contraseña'});
	}

}

// Comprobamos si el usuario y pass existen
function loginUser(req, res){
	var params = req.body; // con body parser automaticamente nos devolvera un objeto JSON

	var email = params.email;
	var password = params.password;

	User.findOne({email: email.toLowerCase()}, (err, user) =>{
		if(err){
			res.status(500).send({message: 'Error en la petición'})
		}else{
			if(!user){
				res.status(404).send({message: 'El usuario no existe'})	
			}else{ 
				// Comprobar la pass
				bcrypt.compare(password, user.password, function(err, check){
					if(check){
						// devolver datos usuario logueado
						if(params.gethash){
							// devolver un token de jwt
							res.status(200).send({
								token: jwt.createToken(user)
							});
						}else{
							res.status(200).send({user});
						}
					}else{
						res.status(404).send({message: 'El usuario no ha podido loguearse'})
					}
				})
			}	
		}
	}) //con mongoose lanzamos la consulta, en este caso es como un where
}

// para poder usar estos metodos fuera en una ruta fuera de este fichero
module.exports = {
	pruebas,
	saveUser,
	loginUser
};