const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bCrypt = require('bcrypt-nodejs');
const config = require('../config.js');

String.prototype.isAlphaNumeric = function() {
  var regExp = /^[A-Za-z0-9]+$/;
  return (this.match(regExp));
};

exports.signin = function(req, res) {
  if(!req.body.password || !req.body.username) {
    return res.json({
			success:false,
			message:"invalid parameters"});
  }else{
    User.findOne({username:req.body.username}, function(err, user) {
        if(err){
					console.log("error");
            return res.json({
                success: false,
                message: "Error occured: " + err
            });
        }else{
            if (user) {
							if(!isValidPassword(user, req.body.password)){
								return res.json({
									success:false,
									message: "Incorrect password"
								});
							}else{
								return res.json({
										 success: true,
										 username: user.username,
										 token: user.token
								 });
							}
            }else{
                return res.json({
                    success: false,
                    message: "Such user doesn't exist"
                });
            }
        }
    });
  }
	var isValidPassword = function(user, password){
			return bCrypt.compareSync(password, user.password);
	};
};

exports.signup = function(req, res) {
  if(!req.body.email || !req.body.password || !req.body.username || !req.body.username.isAlphaNumeric()){
		return res.json({
			success:false,
			message:"invalid parameter"
		});
	}else{
    User.findOne({username: req.body.username}, function(err, user) {
      if (err) {
        return res.json({
               success: false,
               message: "Error occured: " + err
           });
      }else{
        if (user) {
          return res.json({
              success: false,
              message: "User already exists!"
          });
        }else{
          var newUser = new User({
                "email": req.body.email,
                "username": req.body.username,
                "password": createHash(req.body.password),
                "created_at": Date.now()
            });
          newUser.save(function(err, user) {
            if(err){
      					console.log(err);
      					return res.json({
      						success:false,
      						message:"error!"
      					});
      				}else {
              user.token = jwt.sign(config.secret, "tokengenerated");
              user.save(function(err, user1) {
                if(err){
        					console.log(err);
        					return res.json({
        						success:false,
        						message:"error!!!"
        					});
          			}
                return res.json({
                    success: true,
                    username:user1.username,
                    token:user1.token
                });
              });
						}
       	});
       }
      }
    });
  }
	var createHash = function(password){
			return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
	};
};

exports.me = function(req, res) {
  User.findOne({token: req.token}, function(err, user) {
        if (err) {
          return res.json({
                type: false,
                data: "Error occured: " + err
            });
        } else {
          return res.json({
                type: true,
                data:{
                    username: user.username,
                    email: user.email,
                    token: user.token
                }
            });
        }
    });
};

exports.ensureAuthorized = function (req, res, next) {
    var bearerToken;
    var bearerHeader = req.get('Authorization');
    if (typeof bearerHeader !== 'undefined') {
        var bearer = bearerHeader.split(" ");
        bearerToken = bearer[1];
        req.token = bearerToken;
        User.findOne({token:bearerToken}, function(err, user){
          if(err) {
            res.send(403);
          } else if(user) {
            req.user = user;
  					next();
          } else {
            res.send(403);
          }
        });
    } else {
        res.send(403);
    }
};
