var mongoose = require('mongoose');
var crypto = require('crypto');
var Schema = mongoose.Schema;

var userSchema = new Schema({
	email: {
		type: String,
		match: [/.+\@.+\..+/, 'Please use a valid email'] //change the parameters google it
	},
	username: {
		type: String,
		unique: true,
		required: 'Username is required',
		trim: true
	},
	password: {
		type: String,
		validate: [
		function(password) {
			return password && password.length > 6;
			}, 'Password must be longer'
		]
		//you can add a match logic to make it more advanced
	},
	salt: { //this is the encription
		type: String
	},
	provider: {
		type: String,
		required: 'Provider is required'
	}
});

userSchema.pre('save', function(next) {
	if (this.password) {
		this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
		this.password = this.hashPassword(this.password);
	}
	next();
});

userSchema.methods.hashPassword = function(password) {
	return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
};
userSchema.methods.authenticate = function(password) {
	return this.password === this.hashPassword(password);
};
userSchema.statics.findUniqueUsername = function(username, suffix, callback) {
	var _this = this;
	var possibleUsername = username + (suffix || '');
	
	_this.findOne({
		username: possibleUsername
	}, function(err, user) {
		if (!err) {
			if (!user) {
				callback(possibleUsername);
			} else {
				return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
			}
		} else {
			callback(null);
		}
	   });
};

userSchema.set('toJSON', {
	getters: true,
	virtuals: true
});

mongoose.model('User', userSchema);

module.exports = mongoose.model('User', userSchema);
