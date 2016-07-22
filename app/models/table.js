var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tableSchema  = new Schema ({
  title: {type:String, unique:true, required:true},
  description: {type:String, required:true},
  category: {type:String, required:true},
  created_at:{type:Date, default:Date.now},
  updated_at: Date,
  hash_tag: {type:String},
  post_num:{type:Number, default:0},
  member_count:{type:Number, default:0},
  member_list:[{type:Schema.ObjectId, ref:'User'}],
	post_id:[{type:Schema.ObjectId, ref:'Post'}],
	image_id:[{type:Schema.ObjectId, ref:'Image'}],
  creator: {type:String, required:true},
  admin: [{type:Schema.ObjectId, ref:'User'}],
  private: {type:Boolean, required:true},
  board_id: [{type:Schema.ObjectId, ref:'Board'}]
});


var Table = mongoose.model('Table', tableSchema);
module.exports = Table;
