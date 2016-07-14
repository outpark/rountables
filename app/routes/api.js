var express = require('express');
var router = express.Router();
var core_ctrl = require('../controllers/core_ctrl'),
  user_ctrl = require('../controllers/user_ctrl');

exports.initApp = function(app) {
  // router.post('/api/users/signin', user_ctrl.signin);
  // router.post('/api/users/signup', user_ctrl.signup);

    app.route('/api/users/signin')
    .post(user_ctrl.signin);

    app.route('/api/users/signup')
    .post(user_ctrl.signup);

    app.route('*')
    .get(core_ctrl.index);
};
