var Sequelize = require('sequelize');
'use strict';

module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
      isEmpty: false,
      is: ["^[a-z]+$",'i']
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
      isEmpty: false,
      is: ["^[a-z]+$",'i']
    }, 
    email: {
      type: DataTypes.STRING,
      isEmail: true,
      isEmpty: false,
    },
    employer: {
      type: DataTypes.STRING,
      isEmpty: false,
      is: ["^[a-z]+$",'i'],
    },
    occupation: {
      type: DataTypes.STRING,
      isEmpty: false,
      is: ["^[a-z]+$",'i'],
    },
    address_line1: {
      type: DataTypes.STRING,
      isEmpty: false,
      is: ["^[a-z]+$",'i'],
    },
    address_line2: {
      type: DataTypes.STRING,
      isEmpty: false,
      is: ["^[a-z]+$",'i'],
    },
    city: {
      type: DataTypes.STRING,
      isEmpty: false,
      is: ["^[a-z]+$",'i'],
    },
    state: {
      type: DataTypes.STRING,
      isEmpty: false,
      is: ["^[a-z]+$",'i'],
    },
    zip: {
      type: DataTypes.INTEGER,
      isEmpty: false,
    }
  });

  User.associate = function(models) {
    models.User.hasMany(models.Donation);
  };

  User.createCustomer = function(callback) {
    stripe.customers.create({
      email: new_user.email,
      source: user['stripe_token']
    }, function(err, customer) {
      if (err) {
        console.log(err);
        switch (err.type) {
          case 'StripeCardError':
            // A declined card error
            callback(err.message, null);
            break;
          case 'RateLimitError':
            // Too many requests made to the API too quickly
            callback(err.message, null);
            break;
          case 'StripeInvalidRequestError':
            // Invalid parameters were supplied to Stripe's API
            callback(err.message, null);
            break;
          case 'StripeAPIError':
            // An error occurred internally with Stripe's API
            callback(err.message, null);
            break;
          case 'StripeConnectionError':
            // Some kind of error occurred during the HTTPS communication
            callback(err.message, null);
            break;
          case 'StripeAuthenticationError':
            // You probably used an incorrect API key
            callback(err.message, null);
            break;
          default:
            // Handle any other types of unexpected errors
            callback(err.message, null);
            break;
        } 
        return;
      }
      
      console.log(customer);
      callback(null, customer);
    });
  };
  return User;
};
