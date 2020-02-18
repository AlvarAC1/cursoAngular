'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getAlbum(req, res){
	var albumId = req.params.id; 

	// path seria la propiedad donde se van a cargar los datos asociados a esta propiedad
	// con populate({path: 'artist'}) conseguimos todos los datos del artista que ha creado un album
	// saca todo el documento cuyo id esta guardado default en la propiedad artist del documento que tengamos guardado en la base de datos
	
	Album.findById(albumId).populate({path: 'artist'}).exec((err, album)=>{
		if(err){
			res.status(500).send({message: 'Error en la petición'});
		}else{
			if(!album){
				res.status(404).send({message: 'El album no existe.'});
			}else{
				res.status(200).send({album});
			}
		}
	});
}

function saveAlbum(req, res){
	var album = new Album();

	var params = req.body;
	album.title = params.title;
	album.description = params.description;
	album.year = params.year;
	album.image = 'null';
	album.artist = params.artist;

	album.save((err, albumStored) => {
		if(err){
			res.status(500).send({message: 'Error en el servidor'});
		}else{
			if(!albumStored){
				res.status(404).send({message: 'No se ha guardado el album'});
			}else{
				res.status(200).send({album: albumStored});
			}
		}
	});
}


module.exports = {
	getAlbum,
	saveAlbum
};