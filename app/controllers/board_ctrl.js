const async = require('async');
const User = require('../models/user');
const Table = require('../models/table');
const Board = require('../models/board');
const winston = require('winston');
const Hashtag = require('../models/hashtag');
const pry = require('pryjs');

exports.listTables = function(req, res) {
  // define conditions by categories
  var conditions = {};
  if(req.params.category){
    conditions = {category:req.params.category};
  }
  async.waterfall([
    function(callback) {
      Table.find(conditions)
      .limit(30)
      .sort({_id:-1})
      .exec(function(err, tables) {
        if(err){
          return res.json({
            success:false,
            message:err
          });
        }else{
          callback(null, tables);
        }
      });
    }
  ], function(err, tables) {
    if(err) {
      return res.json({success:false, message:err});
    }else {
      return res.json({
        success:true,
        data: tables
      });
    }
  });
};

exports.createTable = function(req, res) {
  if(!req.body.title || !req.body.description || !req.body.category || !req.body.creator || !req.body.private){
    return res.json({
      success: false,
      message: "Invalid parameters"
    });
  }else{
    async.waterfall([
      function(callback){
        Table.findOne({title:req.body.title}, function(err,table){
          if(err){
            console.log(err);
            return res.json({
              success:false,
              message:"Error occured in the first validation"
            });
          }else if(table){
            return res.json({
              success:false,
              message:"Same title already exists."
            });
          }else{
            callback(null);
          }
        });
      },
      function(callback){
        User.findOne({username:req.body.creator}, function(err, user){
          if(err){
            winston.warn("Failed find a user with creator's name");
            callback("FAILED TO FIND CREATOR");
          }else{
            if(user){
              callback(null, user);
            }else{
              callback("Such user doesn't exist!");
            }

          }
        });
      }, function(creator, callback){
        if(creator === undefined || req.body.hashtags.length === 0){
          return res.json({
            success:false,
            message:"error in second validation"
          });
        }
        // create and save hashtags
        console.log("Title: " + req.body.title);
        var newTable = new Table({
            title: req.body.title,
            description: req.body.description,
            category: req.body.category,
            creator: {
              _id:creator.id,
              username:creator.username
            },
            admin: {
              user_id:creator.id,
              username:creator.username
            },
            private: req.body.private
          });
        Table.create(newTable, function(err, table) {
          if(err){
            winston.warn(err);
            return res.json({
              success:false,
              message:err
            });
          }else{
            hashtagHandler(req.body.hashtags, table);
            table.member_list.push({
              _id:creator.id,
              username:creator.username
            });
            table.markModified("member_list");
            table.member_count++;
            table.admins.push({
              _id:creator.id,
              username:creator.username
            });
            table.markModified("admins");
            creator.table_id.push(table.id);
            callback(null, table, creator);
          }
        });
      }, function(table, creator, callback){
        // we currently don't need all this work with Board. we have only one universal board
        Board.findOne({title:table.category}, function(err, board){
          if(err){
            winston.warn(err);
            return res.json({
              success:false,
              message:"Error occured in saving in board."
            });
          }else{
            if(!board){
              console.log("CREATING A NEW BOARD");
              var newBoard = new Board({
                title: table.category
              });
              Board.create(newBoard, function(err, board){
                if(err) return res.json({success:false, message:err});
                board.table_id.push(table._id);
                board.table_count++;
                board.save(function(err){
                  if(err) return res.json({success:false, message:err});
                  winston.info("Successfully created a table and saved in the new board:"+board.title);
                  callback(null, table, creator, board);
                });
              });
            }else{
              winston.info("Successfully created a table and saved in the board:"+board.title);
              table.board_id = board._id;
              board.table_id.push(table._id);
              board.table_count++;
              callback(null, table, creator,board);
            }
          }
        });
      }
    ], function(err, table, creator, board){
      if(err){
        return res.json({
          success:false,
          message:err
        });
      }else{
        table.save(function(err){
          if(err) console.log(err);
          else{
            console.log("table updated!");
          }
        });
        creator.save(function(err){
          if(err) console.log(err);
          else{
            console.log("creator updated!");
          }
        });
        board.save();
        return res.json({
          success:true,
          data:table,
          message: table.title+" created in "+board.title
        });
      }
    });
  }
};

// Possible bug in this.. when handling uppercase letters.
function hashtagHandler(hashtags, myTable) {
  winston.info("hashtags in process..."+myTable.title);
  async.each(hashtags, function(tag, callback){
    console.log(tag);
    tag = tag.toLowerCase();
    Hashtag.findOneAndUpdate({tag_name:tag}, {$inc:{count:1}}, function(err, hashtag){
      if(err){
        winston.warn("Error occured while handling hashtags: "+err);
        callback(err);
      }
      if(hashtag){
        hashtag.table_id.push(myTable.id);
        hashtag.save();
        myTable.hashtags.push(hashtag.tag_name);
        callback();
      }else{
        var newHashtag = new Hashtag({
          tag_name:tag,
          table_id:myTable.id
        });
        newHashtag.save(function(err, hashtag){
          if(err){
            return callback(err);
          }else{
            Table.update({_id:myTable.id},{$push:{hashtags:tag}},function(err,table){
              if(err){
                return callback(err);
              }else{
                callback();
              }
            });
          }
        });
      }
    });
  },  function(err){
    if(err){
      winston.warn("hashtags processing with err: "+err);
    }else{
      myTable.save(function(err){
        if(err){
          winston.warn("Error occured while updating table"+err);
        }else{
          winston.info("hashtags processing has been completed!");
        }
      });
    }
  });
}
