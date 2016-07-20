var async = require('async');
var User = require('../models/user');
var Table = require('../models/table');
var Board = require('../models/board');
var Promise = require("bluebird");
var winston = require('winston');


exports.listTables = function(req, res) {
  // define conditions by categories
  var conditions = {};

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
    var creatorId;
    async.waterfall([
      function(callback){
        User.findOne({username:req.body.creator}, function(err, user){
          if(err){
            winston.warn("Failed find a user with creator's name");
            callback(null, undefined);
          }else{
            creatorId = user._id;
            callback(null, creatorId);
          }
        });
      }, function(creatorId, callback){
        var newTable;
        if(creatorId === undefined){
          newTable = new Table({
            title: req.body.title,
            description: req.body.description,
            category: req.body.category,
            creator: req.body.creator,
            private: req.body.private
          });
        }else{
          newTable = new Table({
            title: req.body.title,
            description: req.body.description,
            category: req.body.category,
            creator: req.body.creator,
            admin: creatorId,
            private: req.body.private
          });
        }
        Table.create(newTable, function(err, table) {
          if(err){
            winston.warn(err);
            return res.json({
              success:false,
              message:err
            });
          }else{
            table.member_count++;
            callback(null, table);
          }
        });
      }, function(table, callback){
        Board.find({title:table.category}, function(err, board){
          if(err){
            winston.warn(err);
            return res.json({
              success:false,
              message:"Error occured in saving on board."
            });
          }else{
            winston.info("Successfully created a table and saved in the board:"+board.title);
            table.board_id = board._id;
            board.table_id.push(table._id);
            callback(null, table, board);
          }
        });
      }
    ], function(err, table, board){
      if(err){
        return res.json({
          success:false,
          message:err
        });
      }else{
        return res.json({
          success:true,
          data:table,
          message: table.title+" created in "+board.title
        });
      }
    });
  }
};
