var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema  = new Schema ({
  content: {type:String, required:true},
  created_at:{type:Date, default:Date.now},
  updated_at: Date,
  color:String,
  comment_num:{type:Number, default:0},
	comment_id:[{type:Schema.ObjectId, ref:'Comment'}],
	image_id:[{type:Schema.ObjectId, ref:'Image'}],
  table_id:{type:Schema.ObjectId, ref:'Table'},
  video_url:String,
  author: {type:String, required:true}
});


var Post = mongoose.model('Post', postSchema);
module.exports = Post;
