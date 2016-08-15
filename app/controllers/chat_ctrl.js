"use strict";

const Groupchat = require('../models/groupchat'),
      Message = require('../models/message'),
      User = require('../models/user');

exports.getGroupchat = function(req, res) {
  if(!req.params.groupchatId){
    return res.json({
      success:false,
      message:"groupchat id must exist in parameters"
    });
  }
  let conditions = {_id: req.params.groupchatId}
  Message.find(conditions)
  .sort("-created_at")
  .populate({
    path:'author',
    select:'username profile'
  })
  .exec(function(err, messages) {
    if(err){
      return res.json({
        success:false,
        message:err
      });
    }else{
      return res.json({
        success:true,
        data: messages
      });
    }

  });
}

exports.initiateChat = function(req, res) {
  
}
