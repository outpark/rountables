const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const grouphhatSchema = mongoose.Schema({
  table_id: [{type:Schema.ObjectId, ref:'Table'}],
  participants: [{ type: Schema.Types.ObjectId, ref: 'User'}],
  created_at:{type:Date, default:Date.now}
});

// create a model from the chat schema
const Groupchat = mongoose.model('Groupchat', groupchatSchema);
module.exports = Groupchat;
