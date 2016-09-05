const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bCrypt = require('bcrypt-nodejs');
const config = require('../config.js');
const pry = require('pryjs');

String.prototype.isAlphaNumeric = function() {
  var regExp = /^[A-Za-z0-9]+$/;
  return (this.match(regExp));
};

exports.signin = function(req, res) {
  if(!req.body.password || !req.body.email || !req.body.password) {
    return res.json({
			success:false,
			message:"Invalid parameters."});
  }else{
    User.findOne({email:req.body.email}, function(err, user) {
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
									message: "Incorrect password."
								});
							}else{
								return res.json({
										 success: true,
										 username: user.username,
                     email: user.email,
										 token: user.token
								 });
							}
            }else{
                return res.json({
                    success: false,
                    message: "Such user doesn't exist."
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
			message:"Invalid parameters."
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
              message: "User already exists."
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
      						message:"Failed to save user." + err
      					});
      				}else {
              user.token = jwt.sign(user, config.jwtSecret);
              user.save(function(err, user1) {
                if(err){
        					console.log(err);
        					return res.json({
        						success:false,
        						message:"Problem with updating user info from DataBase."
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

  if(!req.params.token){
    return res.status(401).json({
      success:false,
      message: 'Must pass token'
    });
  }
  jwt.verify(req.params.token, config.jwtSecret, function(err, t_user) {
    if (err) throw err;
    User.findById(t_user._doc._id, function(err, user) {
          if (err) {
            return res.json({
                  success: false,
                  message: "Error occured: " + err
              });
          } else {
            if (user){
              return res.json({
                      success: true,
                      username: user.username,
                      email: user.email,
                      token: user.token
                    });
            }else{
              return res.json({
                    success: false,
                    message: "Failed to find user with that token"
                });
            }
          }
      });
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

exports.show = function(req, res) {
  if(!req.params.username){
    return res.json({
      success:false,
      message:"Username must exist."
    });
  }
  // populate w/o password!
  User.findOne({"username":req.params.username})
  .exec(function(err, user){
    if(err){
      return res.json({
        success:false,
        message:"Error occured while retrieving user."
      });
    }
    if(user){
      return res.json({
        success: true,
        user: user
      });
    }else{
      return res.json({
        success:false,
        message:"Such user doesn't exist."
      });
    }
  });
}

exports.edit = function(req, res){
  if(!req.body.which || !req.params.username || !req.body.toWhat){
    return res.json({
      success:false,
      message:"Incorret parameters."
    });
  }
  let userToUpdate = req.params.username;
  console.log("TO UPDATE:" + req.body.which);
  User.findOne({"username":userToUpdate})
  .exec(function(err, user){
    if(err){
      return res.json({
        success:false,
        message:"Error occured while retrieving user."
      });
    }
    if(user){

      console.log(req.body.which === "introduction");
      switch(req.body.which){
        case "introduction":
          user.introduction = req.body.toWhat;
          break;
        case "work":
          user.work.push(req.body.toWhat);
          user.markModified("work");
          break;
        case "education":
          user.education.push(req.body.toWhat);
          user.markModified("education");
          break;
        default:
          return res.json({
            success:false,
            message: "Could not update user."
          });
      }

      user.save(function(err, updatedUser){
        if(err){
          return res.json({
            success:false,
            message:"Problem occured while updating user info."
          });
        }else{
          console.log("Is the user updated: "+updatedUser);
          return res.json({
            success:true,
            user: updatedUser
          });
        }
      })
    }else{
      return res.json({
        success:false,
        message:"Such user doesn't exist."
      });
    }
  });

}

exports.delete = function(req, res){

}
