var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  username: {type:String, unique:true, required:true},
  password: {type:String, required:true},
  email: {type:String, unique:true, required:true},
  color: String,
  created_at:{type:Date, default:Date.now},
  token: {type:String}
});

var User = mongoose.model('User', userSchema);
module.exports = User;