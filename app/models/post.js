var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema  = new Schema ({
  content: {type:String, required:true},
  author: {type:String, required:true},
  color:String,
  comment_num:{type:Number, default:0},
	comment_id:[{type:Schema.ObjectId, ref:'Comment'}],
	image_id:[{type:Schema.ObjectId, ref:'Image'}],
  table_id:{type:Schema.ObjectId, ref:'Table'},
  video_url:[{type:String}],
  created_at:{type:Date, default:Date.now},
  updated_at: Date
});


var Post = mongoose.model('Post', postSchema);
module.exports = Post;
