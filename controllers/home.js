//takes the browser's request and lets us send back a page or other information
var imageModel = require('../models').Image; //the .Image is referring to the index.js Image
var stats = require('../helpers/stats');

module.exports = {
	index: function(req, res) {
		var viewModel = {
			images: {},
			sidebar: {}
		}

		imageModel.find(function(err, images) {

			viewModel.images = images;

			stats(viewModel, function(viewModel){
				res.render('index', viewModel);
			})
        	
        });
	}
};
