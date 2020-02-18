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

function getAlbums(req, res){
	var artistId = req.params.artist;

	if(!artistId){
		// Sacar todos los albums de la bbdd
		var find = Album.find({}).sort('title');
	}else{
		// Sacar los albums de un artista concreto de la bbdd
		var find = Album.find({artist: artistId}).sort('year');
	}

	// en que propiedad va a cargar/popular esa informacion (artist), 
	// va a ver que porpiedad tiene el id de otro objeto guardado, y 
	// ahi es donde va a sustituir los datos del otro objeto al que esta asociado
	find.populate({path: 'artist'}).exec((err, albums) => {
		if(err){
			res.status(500).send({message: 'Error en la petición'});
		}else{
			if(!albums){
				res.status(404).send({message: 'No hay albums'});
			}else{
				res.status(200).send({albums});
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

function updateAlbum(req, res){
	var albumId = req.params.id;
	var update = req.body;

	Album.findByIdAndUpdate(albumId, update, (err, albumUpdated) => {
		if(err){
			res.status(500).send({message: 'Error en el servidor'});
		}else{
			if(!albumUpdated){
				res.status(404).send({message: 'No se ha actualizado el album'});
			}else{
				res.status(200).send({album: albumUpdated});
			}
		}
	});
}

function deleteAlbum(req, res){
	var albumId = req.params.id; 

	Album.findByIdAndRemove(albumId, (err, albumRemoved)=>{
		if(err){
			res.status(500).send({message: 'Error al eliminar el album'});
		}else{
			if(!albumRemoved){
				res.status(404).send({message: 'El album no ha sido eliminado'});
			}else{

				Song.find({album: albumRemoved._id}).remove((err, songRemoved)=>{
					if(err){
						res.status(500).send({message: 'Error al eliminar la canción'});
					}else{
						if(!songRemoved){
							res.status(404).send({message: 'La canción no ha sido eliminada'});
						}else{
							res.status(200).send({album: albumRemoved});
						}
					}
				});
			}
		}
	});
}


module.exports = {
	getAlbum,
	saveAlbum,
	getAlbums,
	updateAlbum,
	deleteAlbum
};