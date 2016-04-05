var express = require('express');
var config = require('./server/configure');
var mongoose = require('mongoose');

var app = express();

// Passport
var passport = require('./server/passport');
passport = passport();

//sets the default port for our server
app.set('port', process.env.PORT || 3000);
//sets the directory for views (pages)
app.set('views', __dirname + '/views');
//uses our server configuration file (required as a module)
app = config(app);

mongoose.connect('mongodb://localhost/unflickr');
mongoose.connection.on('open', function() {
	console.log('Mongoose connected.');
});
var server = app.listen(app.get('port'), function() {
	console.log('Server up: http://localhost:' + app.get('port'));
});