var Sequelize = require('sequelize');
var stripe = require('stripe')(process.env.STRIPE_KEY);
'use strict';

module.exports = (sequelize, DataTypes) => {
  var Donation = sequelize.define('Donation', {
    amount: DataTypes.INTEGER, 
    user_id: DataTypes.INTEGER, 
    stripe_customer_id: DataTypes.INTEGER, 
    stripe_payment_id: DataTypes.INTEGER 
  });

  Donation.limit = function() {
    return 500;
  }

  Donation.amounts = function() {
    return [25, 50, 100, 250, 500];
  }

  return Donation;
};