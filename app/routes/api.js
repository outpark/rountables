exports.initApp = function(app) {

  app.get('/', function (req, res) {
    res.sendFile('index.html', {root: './public/views'});
  });

};
