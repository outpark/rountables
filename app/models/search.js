// save each user search
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const searchSchema = mongoose.Schema({
  user_id: {type:Schema.ObjectId},
  hashtags: [{type:String}],
  title: String,
  created_at:{type:Date, default:Date.now}
});

const Search = mongoose.model('Search', searchSchema);
module.exports = Search;
