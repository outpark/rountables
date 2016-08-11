const express = require('express');
const path = require('path');
// const Promise = require("bluebird");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');

const winston = require('winston');
const assert = require('assert');
const async = require('async');
const config = require('./app/config.js');
const morgan = require('morgan');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 5000;
// app.use(favicon(__dirname + '/client/img/favicon.ico'));

// Connect to DB
const mongoURL = config.database;
console.log(mongoURL);
mongoose.Promise = global.Promise;
mongoose.connect(mongoURL);
const db = mongoose.connection;
db.once("open", function(){
  winston.info("DB running");
});
db.on("error", function(err){
  winston.warn("DB ERROR : ", err);
});

//socket io
io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});

app.use(express.static(path.join(__dirname +'/client')));


// Setup routes
require('./app/routes/api').initApp(app);

http.listen(port, function () {
  winston.info('Server is running.');
  winston.info('Listening on port ' + port);
});
