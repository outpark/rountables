const async = require('async');
const User = require('../models/user');
const Table = require('../models/table');
const Post = require('../models/post');
const Promise = require("bluebird");
const winston = require('winston');


// TODO: Name functions that are used every where and reuse duplicate ones
// Think of a good way to paginate

exports.show = function(req, res){
  if(!req.params.table_id){
    return res.json({
      success:false,
      message: "Table Id is needed!"
    });
  }

  Table.findById(req.params.table_id)
  .exec(function(err, table){
    if(err){
      return res.json({
        success:false,
        message: "Problem with retrieving table information"
      });
    }else{
      if(!table){
        return res.json({
          success:false,
          message: "Problem with retrieving table from database"
        });
      }
      return res.json({
        success:true,
        table: table
      });

    }
  });
}

exports.edit = function(req, res){
  //TODO: implement this to handle various types of edition?

}

exports.delete = function(req, res){
  //TODO: implement this action

}


exports.listPosts = function(req, res){
  var conditions = {table_id:req.params.table_id};
  var sort = {_id:-1};

// below is not good. we shoud get the ids saved in tables and find post with those ids. this will look for all the posts.
  console.log("Getting the posts");
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
              if(!user) {callback("Such user doesn't exist")}
              console.log(user);
              members.push(user);
              callback();
            }
          });
        }, function(err){
          if(err){
            winston.warn("Error occured in getting member list: "+err);
            return callback(err);
          }else{
            winston.info("Succefully processed all members");
            callback(null, members);
          }
        });
      }else{
        winston.warn("There's no user");
        return callback("No existing users");
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
      message: "Invalid Inputs."
    });
  }else{
    // update with video or images
    let post = new Post({
      content: req.body.content,
      author: req.body.author,
      color: req.body.color,
      table_id: req.params.table_id
    });

    async.waterfall([
      function(callback) {
        Post.create(post, function(err, post){
          if(err){
            winston.warn("Error occured:" + err);
            return res.json({success:false, message:err});
          }else{
            winston.info("Successfully saved a post:"+post._id);
            callback(null, post);
          }
        });
      }, function(post, callback){
        Table.findOne({_id:req.params.table_id}, function(err, table){
          if(err) return callback(err, table);
          else {
            table.post_num++;
            table.post_id.push(post._id);
            table.save();
            callback(err, post);
          }
        });
      }
    ],function(err, post){
      if(err) return res.json({success: false, message:err});
      else{
        return res.json({
          success: true,
          data: post
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

  Table.findOne({})
  .exec(function(err, table){

  });

  Post.findByIdAndRemove(req.params.post_id, function(err, post) {
  if(err){
    return res.json({success:false, message:err});
  }else {
    return res.json({success:true, message:post._id+" has been deleted"});
  }
});
};


//TODO: for both addMember and approve, prevent duplicate requests
exports.addMember = function(req, res) {
  // case1: table is private
  // case2: table is public
  // case3: admin invites an user
  if(!req.params.table_id || !req.body.username){
    return res.json({
      success:false,
      message:"Invalid parameters"
    });
  }
  async.waterfall([
    //find table
    function(callback){
      Table.findOne({_id:req.params.table_id})
      .exec(function(err, table){
        if(err){
          return res.json({
            success: false,
            message: "Failed to retrieve table"
          });
        }else{
          callback(null, table);
        }
      });
    }, function(table, callback){
      User.findOne({'username':req.body.username})
      .exec(function(err, user){
        if(err){
          return res.json({
            success: false,
            message: "Failed to retrieve user"
          });
        }else{
          callback(null, table, user);
        }
      });
    }, function(table, user, callback){
      if(table.private === false){
        table.member_list.push({
          _id:user._id,
          username:user.username
        });
        table.member_count++;
        table.markModified('member_list');
        User.update({_id:user._id},{$push:{table_id:table._id}}, function(err, user){
          if(err){
            winston.info("Failed to update user with table id");
            callback("Failed to update user with table id");
          }else{
            callback(null, table, user);
          }
        });
      }else{
        table.join_request.push({
          _id:user._id,
          username:user.username
        });
        table.markModified('join_request');
        callback(null, table, user);
      }
    }
  ], function(err, table, user) {
    if(err){
      return res.json({
        success:false,
        message:"Failed to process join request " + err
      });
    }else{
      table.save(function(err){
        if(err){
          return res.json({
            success:false,
            message:"Failed to save table" + err
          });
        }else{
          return res.json({
            success:true,
            message:"Successfully processed join request",
            user:user,
            table:table
          });
        }
      });
    }
  });
};

// to approve user join request
exports.approve = function(req, res){
  if(!req.params.table_id || !req.body.user_id){
    return res.json({
      success:false,
      message:"Invalid parameters"
    });
  }else{
    async.waterfall([
      function(callback){
        User.findOne({_id:req.body.user_id})
        .exec(function(err, user){
          if(err){
            callback("Failed to retrieve user");
          }else{
            if(user.table_id.includes(req.params.table_id)){
              callback("User already added to that table");
            }else{
              user.table_id.push(req.params.table_id);
              callback(null, user);
            }

          }
        });
      }, function(user, callback){
        Table.findByIdAndUpdate(req.params.table_id,{ $pull: { "join_request": { _id: user._id}}},{new: true},
        function(err, myTable){
          if(err){
            return res.json({
              success:false,
              message:"Failed to retrieve table with "+ req.params.table_id
            });
          }else{
            callback(null, user, myTable);
          }
        });
      }, function(user, table, callback){
        table.member_list.push({
          _id:user._id,
          username:user.username
        });
        table.markModified('member_list');
        table.member_count++;
        table.save(function(err){
          if (err){
            return callback(err);
          }else{
            callback(null, user, table);
          }
        });
      }
    ], function(err, user, table){
      if(err){
        winston.warn(err);
        return res.json({
          success:false,
          message:err
        });
      }else{
        winston.info("A user has been approved to join table: "+table._id);
        return res.json({
          success:true,
          message:"Successfully approved " +user.username+ " to join the table",
          user:user,
          table:table
        });
      }
    });
  }
};
// TODO: test this
exports.removeMember = function(req, res) {
  if(!req.body.user_id || !req.params.table_id){
    return res.json({
      success:false,
      message:"user id must exist"
    });
  }
  async.waterfall([
    function(callback){
      User.findByIdAndUpdate(req.body.user_id,{$pull: {"table_id": req.params.table_id}},{new: true},
    function(err, user){
      if(err){
        return callback("Failed to remove table_id from user");
      }else{
        winston.info("Removed table_id from user");
        callback(null, user);
      }
    });
  }, function(user, callback){
      Table.findByIdAndUpdate(req.parms.table_id,{$pull:{ "member_list": {_id:req.body.user_id}}},{new: true},
        function(err, table){
          if(err){
            return callback("Failed to remove table_id from user");
          }else{
            winston.info("Removed member_list from table");
            callback(null, user, table);
          }
      });
    }
  ], function(err, user, table){
      if(err){
        winston.info("Failed to process table and user");
        return res.json({
          success:false,
          message: "Error occured while updating table and user"
        });
      }else{
        winston.info("Table and user processign completed");
        return res.json({
          success: true,
          message: "Successfully updated both table and user data",
          user: user,
          table: table
        });
      }
  });
};
