var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Isaac Rosenberg for Supervisor 2018', subtitle: null });
});

router.get('/donate', function(req, res, next) {
  res.render('donate', { title: 'Donate', amount: 'Amount', placeholder: 'Custom Amount', amounts: [25, 50, 100, 250, 500], contribution_limit: 500, currency: "USD"})
})

router.get('/complete', function(req, res, next) {
  res.render('complete', {
    message: "Thank you so much! Can't wait to revive our generation together 🙏🏼", 
    subtitle: "Come join the conversation", 
    facebook: "https://facebook.com/2018Rosenberg",
    twitter: "https://twitter.com/2018Rosenberg"
  });
})

module.exports = router;
