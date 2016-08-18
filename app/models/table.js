const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tableSchema  = new Schema ({
  title: {type:String, unique:true, required:true},
  description: {type:String, required:true},
  category: {type:String, required:true},
  created_at:{type:Date, default:Date.now},
  updated_at: Date,
  creator:{
    _id:{type:Schema.ObjectId},
    username:{type:String}
  },
  admins: [{
    _id:{type:Schema.ObjectId},
    username:{type:String}
  }],
  post_num:{type:Number, default:0},
  member_count:{type:Number, default:0},
  member_list:[{
    _id:{type:Schema.ObjectId},
    username:{type:String}
  }],
  join_request:[{
    _id:{type:Schema.ObjectId},
    username:{type:String}
  }],
	post_id:[{type:Schema.ObjectId, ref:'Post'}],
	image_id:[{type:Schema.ObjectId, ref:'Image'}],
  private: {type:Boolean, required:true},
  hashtags: [{type:String}],
  board_id: [{type:Schema.ObjectId, ref:'Board'}]
});

tableSchema.index({title: 'text', description: 'text'});

const Table = mongoose.model('Table', tableSchema);
module.exports = Table;
