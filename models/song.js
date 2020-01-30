'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SongSchema = Schema({
		number: String,
		name: String,
		duration: String,
		file: String,
		// relacionamos para mongoose la cancion con el album, por su relación
		album: { type: Schema.ObjectId, ref: 'Album'}
});

module.exports = mongoose.model('Song', SongSchema);