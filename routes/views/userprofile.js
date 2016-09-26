var keystone = require('keystone');
var async = require('async');

exports = module.exports = function(req, res) {

  var view = new keystone.View(req, res);
  var locals = res.locals;

   // Init locals
  locals.section = 'userprofile';
  locals.filters = {
    user: req.params.user,
    category: req.params.category
  };
  locals.data = {
    user:{},
  };
  console.log("profile person")
  // console.log(req.params.user);

  //Load user profile
  view.on('init', function(next) {

    var q = keystone.list('User').model.findOne({
      username: locals.filters.user
    });

    q.exec(function(err, result) {
      if (result) {
        var result2 = JSON.parse(JSON.stringify(result));
        if (result.image.url) {
          // console.log(Object.keys(result._.image))
          result2.image.exifurl = result._.image.src({angle: "exif"});
          console.log(JSON.stringify(result2.image))
        }
        result = result2
      }
      locals.data.user = result;
      next(err);
    });

  });

  // locals.section is used to set the currently selected
  // item in the header navigation.

  // Render the view
  view.render('userprofile');
  };
