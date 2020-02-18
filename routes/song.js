'use strict'

var express = require('express');
var SongController = require('../controllers/song');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/songs'});

api.get('/song', md_auth.ensureAuth, SongController.getSong);


// para poder usarlo fuera de este fichero
module.exports = api;