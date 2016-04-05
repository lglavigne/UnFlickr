var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('mongoose').model('User');

//*****Sets up logic for using the local database to verify users
//*****If we were using Twitter or Facebook, we'd need to verify with their API instead

module.exports = function() {
	passport.use(new LocalStrategy(function(username, password, done) {
		//searches the database for a user with this username
		User.findOne({
			username: username
		}, function (err, user) {
			if (err) {
				return done(err);
			}
			//returns a warning message if username doesn't exist in database
			if (!user) {
				return done(null, false, {
					message: 'Unknown user'
				});
			}
			//returns an error if the password doesn't match the username
			if (!user.authenticate(password)) {
				return done(null, false, {
					message: 'Invalid password'
				});
			}
			//returns a user if there is a validated user
                     console.log("User ", user, "Successfully logged in");
			return done(null, user);
		});
	}));
};