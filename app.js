var express = require('express');
var path = require('path');
var Promise = require("bluebird");
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var http = require('http');
var winston = require('winston');
var assert = require('assert');
var async = require('async');
var config = require('./app/config.js');
var morgan = require('morgan');
var app = express();
var io = require('socket.io')(http);
var port = process.env.PORT || 5000;
// app.use(favicon(__dirname + '/public/img/favicon.ico'));

// Connect to DB
var mongoURL = config.database;
console.log(mongoURL);
mongoose.connect(mongoURL);
var db = mongoose.connection;
db.once("open", function(){
  winston.info("DB running");
});
db.on("error", function(err){
  winston.warn("DB ERROR : ", err);
});

//socket io
io.on('connection', function(socket){
  winston.info('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));

app.use(express.static(path.join(__dirname +'/public')));


// Setup routes
require('./app/routes/api').initApp(app);

app.listen(port, function () {
  winston.info('Server is running.');
  winston.info('Listening on port ' + port);
});
