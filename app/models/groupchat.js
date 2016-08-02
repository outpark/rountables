const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const groupChatSchema = mongoose.Schema({
  created_at:{type:Date, default:Date.now},
  content: String,
  table_id: [{type:Schema.ObjectId, ref:'Table'}],
  user_id:[{type:Schema.ObjectId, ref:'User'}]
});

// create a model from the chat schema
const GroupChat = mongoose.model('GroupChat', groupChatSchema);
