var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
    //this only helps us store each comment on their own box first, in the future we can refer their id to find the specific comment stored.

//*****Create and export the Comment Schema
var CommentSchema = new Schema({
	image_id: { type: String },
	comment: { type: String },
	//need to add the schema for name and email too
	name: { type: String },
	email: { type: String },
	timestamp: { type: Date, 'default': Date.now }
});

CommentSchema.virtual('uniqueID')
	.get(function() {
		console.log('\n\nuniqueID:'+this.image_id+'\n\n');
		return this.image_id;
	});

	
module.exports = mongoose.model('Comment', CommentSchema);