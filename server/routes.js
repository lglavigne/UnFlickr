//pull in our controllers
var home = require('../controllers/home');
var image = require('../controllers/image');
var users = require('../controllers/user');
var passport = require('passport');

module.exports.initialize = function(app, router) {
	//handles browser requests for images
	app.get('/', home.index);
	app.get('/images/:image_id', image.index);
	
	//handles post routes (like a form submission)
	app.post('/images', image.create);
	app.post('/images/:image_id/like', image.like);
	app.post('/images/:image_id/comment', image.comment);
	
	app.use('/', router);

	app.get('/signup', users.renderSignup);
	app.post('/signup', users.signup);
	app.route('/signin')
		.get(users.renderSignin)
		.post(passport.authenticate('local', {
			successRedirect: '/',
			failureRedirect: '/signin',
			//*****displays an error message or welcome depending on authentication
			failureFlash: true,
                  successFlash: 'Welcome!'
		}));
	app.get('/signout', users.signout);

	app.get('/logout', function(req, res){
	  req.logout();
	  res.redirect('/');
	});

	//redirect to login if not logged in
	function ensureAuthenticated(req, res, next) {
	  if (req.isAuthenticated()) { return next(); }
	  res.redirect('/login')
	}



};