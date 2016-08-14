const async = require('async');
const User = require('../models/user');
const Table = require('../models/table');
const Board = require('../models/board');
const winston = require('winston');
const Hashtag = require('../models/hashtag');
const Search = require('../models/search');
const ObjectId = require('mongodb').ObjectID;

// TODO: implement this

exports.listHashtags = function(req, res) {
 let conditions = {};
  Hashtag.find(conditions)
    .sort({count:-1})
    .limit(5)
    .exec(function(err, hashtags){
      if(err){
        return res.json({
          success:false,
          message:err
        });
      }else{
        return res.json({
          success:true,
          data:hashtags
        });
      }
    });
};

exports.hashtagSearch = function(req, res) {
  console.log(req.body);
  console.log(req.body.hashtags);
  if(req.body.hashtags.length < 1){
    return res.json({
      success:false,
      message:"hashtag dosn't exit"
    });
  }

  let tags = req.body.hashtags;
  let data = {
    tags: tags,
    title: null
  };
  if(req.body.userId){
    saveSearch(req.body.userId, data);
  }
  let conditions = {};
  let sort = {member_count:-1};
  if(tags.length === 1){
    conditions = {tag_name: tags[0]};
    async.waterfall([
      function(callback){
        Hashtag.findOne(conditions, function(err, hashtag) {
          if(err){res.json({success:false, message:err});}
          else {
            if (hashtag){
              let tableList = hashtag.table_id;
              callback(null, tableList);
            }else{
              callback("Such hashtag doesn't exist");
            }

          }
        });
      }, function(list, callback){
        let structured = list.map(function(id) { return ObjectId(id); });
        callback(null, structured);
      }, function(ids, callback){
        Table.find({_id: {$in: ids}})
        .sort(sort)
        .limit(20)
        .exec(function(err, tables) {
          if(err) return callback("Error occured in getting tables");
          else {
            winston.info("Retrieved tables form db");
            callback(null, tables);
          }
        });
      }
    ], function(err, tables){
      if(err) {
        return res.json({
          success:false,
          message: err
        });
      }else {
        return res.json({
          success:true,
          data:tables
        });
      }
    });

  }else{
    // TODO: possible error when user typo occured in hashtags
    // also it's much better if we used the tables from the first search, then eliminate.
    winston.info("Processing search with more than one hashtags");
    async.waterfall([
      function(callback){
        // will this work???
        Table.find({"hashtags": {$all: req.body.hashtags}})
        .sort(sort)
        .limit(20)
        .exec(function(err, tables) {
          if(err){
            console.log("1"+err);
            return res.json({
              success:false,
              message: "Error occured during multiple hashtags search"+err
            });
          }else{
            callback(null, tables);
          }
        });
      }
    ], function(err, tables) {
      if(err){
        console.log("2"+err);
        return res.json({
          success:false,
          message:err
        });
      }else{
        return res.json({
          success:true,
          data:tables
        });
      }
    });
  }
};

exports.detailSearch = function(req, res) {
  // at this point, can I use the tables from hashtag search?
  // but this directs to a new page.
  console.log("Details search in progress");
  let data = {
    tags: req.body.hashtags,
    title: req.body.title
  };
  if(req.body.userId){
    saveSearch(req.body.userId, data);
  }
  let conditions = {};
  let sort = {};
  let skip = 0;
  let size = 20;
  if(req.body.title.length < 2) {
    return res.json({
       success:false,
       message:"More than one letter"
    });
  }else{
    if(req.body.hashtags){
      conditions = {"hashtags": {$all: req.body.hashtags},title:{$regex : req.body.title}};
    }else { // w/o tags
      conditions = {title:{$regex : req.body.title}};
    }
      Table.find(conditions)
      .exec(function(err, tables){
        if(err){
          console.log(err);
          return res.json({
            success:false,
            message:err
          });
        }else{
          return res.json({
            success:true,
            data:tables
          });
        }
      });
  }
};


function saveSearch(userId, data) {
  winston.info("Processing a new search");
  let newSearch = new Search({
    user_id: userId,
    hashtags: data.tags,
    title: data.title
  });
  Search.create(newSearch, function(err, search) {
    if(err){
      winston.warn("Error occured while saving a new search");
    }else{
      winston.info("NEW SEARCH processing completed");
    }
  });
}
