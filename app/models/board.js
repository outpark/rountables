var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var boardSchema = new Schema({
  title: {type:String, unique:true, required:true},
  table_id:[{type:Schema.ObjectId, ref:'Table'}],
  created_at:{type:Date, default:Date.now}
});

var Board = mongoose.model('Board', boardSchema);
module.exports = Board;
