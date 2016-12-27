'use strict';

var Hapi = require('hapi');
var app = require('./routes/app.js');

var port = process.env.PORT || 3000;
var host = process.env.HOST || 'localhost';

var server = new Hapi.Server();

server.connection({port: port});

server.route(app); //add routes
 
server.start(function() {
    console.log("Hapi server started @ " + server.info.uri);
});