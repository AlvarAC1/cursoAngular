'use strict'

var fs = require('fs');
var path = require('path');
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
			res.status(500).send({message: 'Error en la petición'});
		}else{
			if(!user){
				res.status(404).send({message: 'El usuario no existe'});
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
						res.status(404).send({message: 'El usuario no ha podido loguearse'});
					}
				})
			}	
		}
	}) //con mongoose lanzamos la consulta, en este caso es como un where
}

function updateUser(req, res){
	var userId = req.params.id;
	var update = req.body;

	User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
		if(err){
			res.status(404).send({message: 'Error al actualizar el usuario'});
		}else{
			if(!userUpdated){
				res.status(404).send({message: 'No se ha podifo actualizar el usuario'});
			}else{
				res.status(200).send({user: userUpdated});
			}

		}
	});
}

function uploadImage(req, res){

	//console.log(req);
	
	var userId = req.params.id;
	var file_name = 'No subido...';
	// Nombre fichero seria: console.log(req.files.image.originalFilename.split('.')[0]);

	if(req.files){
		var file_path = req.files.image.path;
		var file_split = file_path.split('\\');
		var file_name = file_split[2];

		var ext_split = file_name.split('\.');
		var file_ext = ext_split[1];

		if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif'){

			User.findByIdAndUpdate(userId, {image: file_name}, (err, userUpdated) => {
				
				if(!userUpdated){
					res.status(404).send({message: 'No se ha podifo actualizar el usuario'});
				}else{
					res.status(200).send({image: file_name, user: userUpdated});				}

			});

		}else{
			res.status(200).send({message: 'Ectensión del archivo no valida'});
		}

		console.log(file_ext);
	}else{
		res.status(200).send({message: 'No has subido ninguna imagen...'});
	}

}


function getImageFile(req, res){
	var imageFile = req.params.imageFile;
	var path_file = './uploads/users/'+imageFile;

	fs.exists(path_file, function(exists){
//		console.log("Existe? ---> "+exists)
		if(exists){
			res.sendFile(path.resolve(path_file));
		}else{
			res.status(200).send({message: 'No existe la imagen...'});
		}
	});
}


// para poder usar estos metodos fuera
module.exports = {
	pruebas,
	saveUser,
	loginUser,
	updateUser,
	uploadImage,
	getImageFile
};
