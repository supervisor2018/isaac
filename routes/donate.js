var express = require('express');
var router = express.Router();
var Sequelize = require('sequelize');
// var User = Sequelize.import('../models')
// var RSUser = require('../models/user.js');
var RSDonation = require('../models/donation.js');
var valid = require('card-validator');

router.get('/', function(req, res, next) {
  var amounts = RSDonation.amounts();
  var limit = RSDonation.limit(); 
  res.render('donate', 
    { 
      title: 'READY TO ACT?',
      amount: 'Amount',
      amounts: amounts,
      contribution_limit: limit,
      currency: "USD",
      bottom_footer: false
    });
});

router.post('/', function(req, res, next) {
  console.log(req.body); 

  var user = {}; 

  var email = req.body.email;
  var address_line1 = req.body.address_line1;
  var address_line2 = req.body.address_line2;
  var city = req.body.city;
  var state = req.body.state;
  var zip = req.body.zip;
  var zipValidation = valid.postalCode(zip);


  if (!zipValidation.isValid) {
    res.redirect('/donate', {error: "Invalid zip", element: 'zip', page: 2});
    return;
  }

  var employer = req.body.employer;
  var occupation = req.body.occupation;

  user['email'] = email;
  user['first_name'] = req.body.first_name;
  user['last_name'] = req.body.last_name; 
  user['address_line1'] = address_line1;
  user['address_line2'] = address_line2;
  user['city'] = city;
  user['state'] = state;
  user['zip'] = zip;
  user['stripe_token'] = req.body.stripe_token;
  user['employer'] = employer;
  user['occupation'] = occupation;

  User.build(user)
  return;
  RSUser.create(user, function(err, customer) { 
    if (err) {
      res.send(400, {error: err}); 
      return;
    }
    var customer = customer;
    
    var amounts = RSDonation.amounts();
    var amount_index = req.body.amount;
    var custom_amount = req.body.custom_amount;
    var amount = 0;

    if (amount_index > amounts.count - 1 || !amount_index) {
      res.send(400);
      return; 
    }

    if (!amount_index && custom_amount < RSDonation.limit()) {
      amount = req.body.custom_amount; 
    } 

    if (amount > amounts.count - 1 && !amount.isInteger()) {
      res.send(400);
      return;
    }
    
    amount = amounts[amount_index];

    if (amount == 0) {
      res.redirect('/donate');
      return;
    }

    console.log(amount); 
    amount = amount * 100;

    RSDonation.create(amount, customer.id, null, function(err, donation) {
      if (err) {
        console.log(err);
        res.redirect('/donate', {error: err.message});
        return;
      }
      
      res.redirect('/complete');
      return;
    });
  });

});

module.exports = router;
