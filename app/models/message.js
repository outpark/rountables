const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// TODO: implement this
const messageSchema = new Schema({
  username: {type:String, unique:true, required:true},
  password: {type:String, required:true},
  email: {type:String, unique:true, required:true},
  color: String,
  created_at:{type:Date, default:Date.now},
  token: {type:String}
});


const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
