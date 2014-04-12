var express = require('express');
var router = express.Router();

var phantom = require('phantom');

/* GET home page. */
router.get('/', function(req, res) {
  var url, viewportSize, clipRect;

  url = req.query.url;

  if (!url) {
    res.render('index', { title: 'Express' });
    return;
  }

  viewportSize = {
    width: req.query.width || 1000,
    height: req.query.height || 1000
  };

  clipRect = {
    top: req.query.top || 0,
    left: req.query.left || 0,
    width: req.query.wide || viewportSize.width,
    height: req.query.high || viewportSize.height
  };

  phantom.create(function(ph) {
    ph.createPage(function(page) {

      page.set('viewportSize', viewportSize);
      page.set('clipRect', clipRect);
      page.open(url, function(status) {
        if (status !== 'success') {
          ph.exit();
          res.send(400, 'Sorry, url cannot be retrieved');

          return;
        }

        page.renderBase64('PNG', function(png) {
          var img = new Buffer(png, 'base64');
          res.writeHead(200, {
            'Content-Type': 'image/png',
            'Content-Length': img.length
          });
          res.end(img);
          ph.exit();
        });
      });
    });
  });
});

module.exports = router;
