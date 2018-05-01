var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Isaac Rosenberg for Supervisor 2018', subtitle: null });
});

router.get('/donate', function(req, res, next) {
  res.render('donate', { title: 'READY TO ACT?', amount: 'Amount', placeholder: 'How much is CHANGE worth to YOU?', amounts: [25, 50, 100, 250, 500], contribution_limit: 500, currency: "USD"})
})

module.exports = router;
