var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Isaac Rosenberg for Supervisor 2018', subtitle: null });
});

module.exports = router;
