var async = require('async');
var User = require('../models/user');
var Table = require('../models/table');
var Post = require('../models/post');
var Promise = require("bluebird");
var winston = require('winston');

exports.listPosts = function(req, res){

  var conditions = {table_id:req.params.table_id};
  var sort = {_id:-1};

// below is not good. we shoud get the ids saved in tables and find post with those ids. this will look for all the posts.
  async.waterfall([
    function(callback){
      Post.find(conditions)
      .limit(15)
      .sort(sort)
      .exec(function(err, posts) {
        if(err){
          winston.warn("Error occured in listing posts:" + err);
          return res.json({
            success:false,
            message:err
          });
        }else{
          winston.info("received posts from db");
          callback(null, posts);
        }
      });
    }
  ], function(err, posts){
    if(err){
      return res.json({success:false, message:err});
    }else{
      return res.json({
        success:true,
        data: posts
      });
    }

  });
};

exports.listMembers = function(req, res){

  var conditions = {_id:req.params.table_id};
  var sort = {_id:-1};

  async.waterfall([
    function(callback){
      Table.findOne(conditions).exec(function(err, table) {
        if (err) {
          winston.warn("Error occured in listing members: " + err);
          return res.json({success:false, message:err});
        }else{
          winston.info("received table from db: "+table.title);
          var users = table.member_list;
          callback(null, users);
        }
      });

    },
    function(users, callback){
      var members = [];
      // not sure this is a good comparing case
      if(users.length > 0){
        async.each(users, function(userId, callback){
          console.log("Processing each user: " + userId);
          User.findById(userId).exec(function(err, user){
            if(err){
              winston.warn("Error occcured finding a user");
              callback("Invalid userId: "+err);
            }else{
              console.log(user);
              members.push(user);
              callback();
            }
          });
        }, function(err){
          if(err){
            winston.warn("Error occured in getting member list: "+err);
            return callback(err, members);
          }else{
            winston.info("Succefully processed all members");
            callback(null, members);
          }
        });
      }else{
        winston.warn("There's no user");
        return callback("No existing users", members);
      }
    }
  ], function(err, users){
      if(err){
        winston.warn("Error occured in db");
        return res.json({success:false, message:err});
      }else{
        return res.json({
          success:true,
          data:users
        });
      }
  });
};

exports.showChat = function(req, res){


};

exports.createPost = function(req, res){
  if(!req.body.content || !req.body.author || !req.body.color || !req.params.table_id){
    winston.warn("Invalid inputs in creating a post");
    return res.json({
      success: false,
      message: "Invalid inputs"
    });
  }else{
    // update with video or images
    var post = new Post({
      content: req.body.content,
      author: req.body.author,
      color: req.body.color,
      table_id: req.params.table_id
    });
    Post.create(post, function(err, post){
      if(err){
        winston.warn("Error occured:" + err);
        return res.json({success:false, message:err});
      }else{
        winston.info("Successfully saved a post:"+post._id);
        return res.json({
          success:true,
          data:post
        });
      }
    });
  }
};

// below need to adjust to current settings
exports.updatePost = function(req, res) {
  req.body.post.updatedAt = Date.now();
  Post.findByIdAndUpdate(req.params.post_id, req.body.post, function(err, post) {
    if(err) {
      return res.json({success:false, message:err});
    } else {
      return res.json({success:true, message:post._id+" has been updated"});
    }
  });
};

exports.deletePost = function(req, res) {
  Post.findByIdAndRemove(req.params.post_id, function(err, post) {
  if(err){
    return res.json({success:false, message:err});
  }else {
    return res.json({success:true, message:post._id+" has been deleted"});
  }
});
};

exports.addMember = function(req, res) {

};

exports.removeMember = function(req, res) {

};
