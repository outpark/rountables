var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var boardSchema = new Schema({
  title: {type:String, unique:true, required:true},
  location: {type:String, unique:true, required:true},
  created_at:{type:Date, default:Date.now}
});

var Board = mongoose.model('Board', boardSchema);
module.exports = Board;
