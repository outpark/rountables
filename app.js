var express = require('express');
var Promise = require("bluebird");
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var http = require('http');
var app = express();

var app = module.exports = express();
var port = process.env.PORT || 5000;


require('./app/routes/api').initApp(app);


app.listen(port, function () {
  console.log('Example app listening on port ' + port);
});
