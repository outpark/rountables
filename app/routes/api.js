var express = require('express');
var router = express.Router();
var core_ctrl = require('../controllers/core_ctrl'),
  user_ctrl = require('../controllers/user_ctrl'),
  board_ctrl = require('../controllers/board_ctrl'),
  table_ctrl = require('../controllers/table_ctrl');

exports.initApp = function(app) {
  // router.post('/api/users/signin', user_ctrl.signin);
  // router.post('/api/users/signup', user_ctrl.signup);

    app.route('/api/users/signin')
    .post(user_ctrl.signin);

    app.route('/api/users/signup')
    .post(user_ctrl.signup);

    app.route('/api/board')
    .get(board_ctrl.listTables);

// to be implemented
    app.route('/api/board/:category')
    .get(board_ctrl.listTables);

    app.route('/api/board/create/table')
    .post(board_ctrl.createTable);

    app.route('/api/table/:table_id/createpost')
    .post(table_ctrl.createPost);

    app.route('/api/table/:table_id/posts')
    .get(table_ctrl.listPosts);

    app.route('/api/table/:table_id/posts/:post_id/delete')
    .put(table_ctrl.deletePost);
    app.route('/api/table/:table_id/posts/:post_id/update')
    .put(table_ctrl.updatePost);

    app.route('/api/table/:table_id/members')
    .get(table_ctrl.listMembers);


    app.route('*')
    .get(core_ctrl.index);
};
