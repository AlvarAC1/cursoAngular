'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AlbumSchema = Schema({
		title: String,
		description: String,
		year: Number,
		image: String,
		// relacionamos para mongoose el album con el artista, por su relación
		artist: { type: Schema.ObjectiId, ref: 'Artist'}
});

module.exports = mongoose.model('Album', AlbumSchema);