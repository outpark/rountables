var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ChatSchema = mongoose.Schema({
  created_at:{type:Date, default:Date.now},
  content: String,
  table_id: [{type:Schema.ObjectId, ref:'Table'}],
  user_id:[{type:Schema.ObjectId, ref:'User'}]
});

// create a model from the chat schema
var Chat = mongoose.model('Chat', ChatSchema);
