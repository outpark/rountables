const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {type:String, unique:true, required:true},
  password: {type:String, required:true},
  email: {type:String, unique:true, required:true},
  firstname: String,
  lastname: String,
  color: String,
  phone_num: String,
  address_street: String,
  address_city: String,
  introduction: String,
  table_id: [{type:Schema.ObjectId, ref:'Table'}],
  work: [String],
  education: [String],
  profile_url: String,
  created_at:{type:Date, default:Date.now},
  token: {type:String}
});

const User = mongoose.model('User', userSchema);
module.exports = User;
