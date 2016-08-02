const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const hashtagSchema = new Schema({
  tag_name: {type:String, unique:true, required:true},
  table_id: [{type:Schema.ObjectId, ref:'Table'}],
  created_at:{type:Date, default:Date.now},
  count: {type:Number, default:1}
});

const Hashtag = mongoose.model('Hashtag', hashtagSchema);
module.exports = Hashtag;
