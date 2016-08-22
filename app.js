const express = require('express');
const path = require('path');
// const Promise = require("bluebird");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo')(session);
const winston = require('winston');
const assert = require('assert');
const config = require('./app/config.js');
const morgan = require('morgan');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 5000;
const socketEvents = require('./socket_events');

// Connect to DB
const mongoURL = config.database;
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
socketEvents(io);

app.use(express.static(path.join(__dirname +'/client')));
app.use(cookieParser());
app.use(session({
  secret: config.secret,
  saveUninitialized: true,
  resave: true,
  store: new MongoStore({ mongooseConnection: db })
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});


// Setup routes
require('./app/routes/api').initApp(app);

http.listen(port, function () {
  winston.info('Server is running.');
  winston.info('Listening on port ' + port);
});
