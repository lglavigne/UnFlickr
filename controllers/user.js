var User = require('../models/user');
var passport = require('passport');

//takes an error from a Mongoose error object 
//this is global getErrorMessage
var getErrorMessage = function(err) {
	var message = '';
	//these error codes are pre-defined 
	if (err.code) {
		switch (err.code) {
			case 11000:
			case 11001:
				message = 'Username already exists';
				break;
			default:
				message = 'Something went wrong.';
		}
	} else {
		for (var errName in err.errors) {
			if (err.errors[errName].message)
				message = err.errors[errName].message;
		}
	}
	return message;
};
exports.renderSignin = function(req,res,next) {
	if (!req.user) {
		res.render('signin', {
			title: 'Sign-in',
			messages: req.flash('error') || req.flash('info')
		});
	} else {
		return res.redirect('/');
	}
};
exports.renderSignup = function(req,res,next) {
	//returns an error if the user can't be signed up
	if (!req.user) {
		res.render('signup', {
			title: 'Sign-up',
			messages: req.flash('error')
		});
	} else {
		return res.redirect('/');
	}
};
//makes a new local user from the signup information
exports.signup = function(req, res,next) {
	if (!req.user) {
		var user = new User(req.body);
		var message = null;
		//make a new user
		user.provider = 'local';
		
		user.save(function(err) {
			if (err) {
				var message = getErrorMessage(err);
				req.flash('error', message);
				return res.redirect('/signup');
			}
			req.login(user, function(err) {
				if (err)
					return next(err);
				return res.redirect('/');
			});
		});
	} else {
		return res.redirect('/');
	}
};
//sends a logout request and reloads the main page
exports.signout = function(req,res) {
	req.logout();
	res.redirect('/');
};