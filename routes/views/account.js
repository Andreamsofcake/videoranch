var keystone = require('keystone');
var async = require('async');

exports = module.exports = function(req, res) {

  var view = new keystone.View(req, res);
  var locals = res.locals;

   // Init locals
  locals.section = 'account';
  locals.filters = {
    user: req.params.user,
    category: req.params.category
  };

  locals.data = {
    user:{}
  };

  //Load user profile
  view.on('init', function(next) {

    var q = keystone.list('User').model.findOne({
      _id: locals.user._id
    });

    q.exec(function(err, result) {
      locals.data.user = result;
      console.log(result);
      next(err);
    });

  });

  //Load TierTwo
  // view.on('init', function(next) {
	//
  //   keystone.list('TierTwo').model.findOne({
  //     user: locals.user._id
  //   }).
  //   exec(function(err, result) {
  //     locals.data.tierTwo = result;
  //     console.log(locals.data.tiertwo);
  //     next();
  //   });
  // });

  // Update user profile
  view.on('post', { action: 'edit-userprofile' }, function(next) {

    keystone.list('User').model.findOne({
      _id: locals.user._id
    },
    function(err, user){
      if (err) {
        console.log('Error with function');
        req.flash('error', err);
        next();
      } else {
        updater = user.getUpdateHandler(req, res, {
              errorMessage: 'There was an error updating your profile:'
            });

          updater.process(req.body, {
            flashErrors: true,
            fields: 'name, email, username, image, profile, password'
          }, function(err) {
            if (err) {
              locals.validationErrors = err.errors;
              console.log('error', err);
            } else {
              req.flash('success', 'Your profile has been updated');
              return res.redirect('/account');
            }
            next();
          });
      }
    });

  });

  // locals.section is used to set the currently selected
  // item in the header navigation.

  // Render the view
  view.render('account');
  };
