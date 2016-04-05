//*****This file will initialize our user model and set up everything we need to use Passport
var passport = require('passport');
var mongoose = require('mongoose');
var user = require('../models/user');
//*****We need to export a user model to save the info in our database
module.exports = function() {
	var User = mongoose.model('User');
	//*****initializes the user for the session
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});
	//*****destroys the session user instance
	passport.deserializeUser(function(id, done) {
		user.findOne({
			_id: id
			}, '-password -salt', function(err, user) {
				done(err, user);
			});
		});
		//*****requires the module for authenticating based on our local rules
		require('./.strategies/local.js')();
	};
