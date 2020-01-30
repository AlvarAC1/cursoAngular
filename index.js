'use strict'

var mongoose = require('mongoose');

var app = require('./app');

var port = process.env.PORT || 3977;

// Evitar fallos/avisos de Mongoose en la consola
	
	mongoose.set('useFindAndModify', false);
	mongoose.Promise = global.Promise;


mongoose.connect('mongodb://localhost:27017/curso_mean2', { useNewUrlParser:true, useUnifiedTopology: true }
 , (err, res) => {
	if(err){
		throw err;
	}else{
		console.log("---> La conexión a base de datos está funcionando correctamente...");

		app.listen(port, function(){
			console.log("---> Servidor del api rest de musica escuchando en https://localhost:"+port);
		});
	
	}
});