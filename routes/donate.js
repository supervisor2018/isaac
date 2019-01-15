var express = require('express');
var router = express.Router();
var models = require('../models');
var valid = require('card-validator');
var stripe = require('stripe')(process.env.STRIPE_KEY);
var User = models.User;
var Donation = models.Donation;

router.get('/', function(req, res, next) {
  var amounts = Donation.amounts();
  var limit = Donation.limit();
  
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

  // Simply redirect, don't charge the credit card 
  res.redirect('/complete');
  return; 

  console.log(req.body); 

  var userObj = {}; 

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

  userObj['email'] = email;
  userObj['first_name'] = req.body.first_name;
  userObj['last_name'] = req.body.last_name; 
  userObj['address_line1'] = address_line1;
  userObj['address_line2'] = address_line2;
  userObj['city'] = city;
  userObj['state'] = state;
  userObj['zip'] = zip;
  userObj['stripe_token'] = req.body.stripe_token;
  userObj['employer'] = employer;
  userObj['occupation'] = occupation;

  User
      .build(userObj)
      .save()
      .then(user => {
        stripe.customers.create({
          email: user.email,
          source: userObj['stripe_token']
        }).then(function(customer){      
          var amounts = Donation.amounts();
          var amount_index = req.body.amount;
          var custom_amount = req.body.custom_amount;
          var amount = 0;

          if (amount_index > amounts.count - 1 || !amount_index) {
            res.send(400);
            return; 
          }

          if (!amount_index && custom_amount < Donation.limit()) {
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

          // return stripe.charges.create({
          //   amount: amount,
          //   currency: 'usd',
          //   customer: customer.id
          // })
        }).then(function(charge) {
          Donation
                  .build({
                    'amount': charge.amount / 100,
                    'user_id': user.id, 
                    'stripe_customer_id': charge.customer,
                    'stripe_payment_id': charge.id,
                  })
                  .save()
                  .then(donation => {
                    res.redirect('/complete');
                    
                  })
                  .catch(error => {
                    console.log(error);
                    res.send(400);
                    return;
                  })
        })
      })
      .catch(error => {
        console.log(error);
        res.send(400);
        return;
      });
});

module.exports = router;
