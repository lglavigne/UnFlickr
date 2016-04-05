var Models = require('../models'),
	async = require('async');

	module.exports = function(viewModel, callback) {
    async.parallel([
        function(next) {
            //image count happens here
            Models.Image.count({}, next);
        },
        function(next) {
           //comment count happens here
           Models.Comment.count({}, next);
        },
        function(next) {
            //views count happens here
            Models.Image.aggregate({ $group : {
                _id : '1',
                viewsTotal : { $sum : '$views' }
            }}, function(err, result) {
                var viewsTotal = 0;
                if (result.length > 0) {
                    viewsTotal += result[0].viewsTotal;
                }
                next(null, viewsTotal);
            });

        },
        function(next) {
           //likes count happens here
           Models.Image.aggregate({ $group : {
                _id : '1',
                likesTotal : { $sum : '$likes' }
            }}, function (err, result) {
                var likesTotal = 0;
                if (result.length > 0) {
                    likesTotal += result[0].likesTotal;
                }
                next(null, likesTotal); //this is what gathers everything before we do callback
            });

        }
    ], function(err, results){
//here we add the stats to our viewModel in the box for all of our sidebar data. Note how we tally each result from the four functions above, and this final function won’t run without all the results.
        viewModel.sidebar.stats = {
            images: results[0],
            comments: results[1],
            views: results[2],
            likes: results[3]
        };
//then we send our modified viewModel back to the controller after our functions are complete
		callback(viewModel);
    });
};
