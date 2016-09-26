var keystone = require('keystone');
var User = keystone.list('User');

exports = module.exports = function(req, res) {

  var view = new keystone.View(req, res);
  var locals = res.locals;

  // locals.section is used to set the currently selected
  // item in the header navigation.
  locals.section = 'signup';
  locals.formData = req.body || {};
  locals.validationErrors = {};

    if(req.method=="POST"){

		// handle form
		var newUser = new User.model(),

		updater = newUser.getUpdateHandler(req);

		console.log('[SIGNUP+IN] in POST handler');
		console.log( JSON.stringify( req.body ) );

		function redirect_signin(path, req, res) {
		  if (req.body.target && !/\/join|signin|signup/.test(req.body.target)) {
			console.log('[join] - Set target as [' + req.body.target + '].');
			res.redirect(req.body.target);

		  } else {
			if (path.charAt(0) !== '/') {
				path = '/' + path;
			}
			res.redirect(path);
		  }
		}

		updater.process(req.body, {
		  flashErrors: true,
		  fields: 'name, username, email, password'

		}, function(err) {
			console.log('[SIGNUP+IN] ok we are trying to sign up a new user.');
		  if (err) {
			locals.validationErrors = err.errors;
			console.log('[SIGNUP+IN] first error');
			console.log(err);
			redirect_signin('/signup', req, res);

		  } else {
			req.flash('success', 'You are signed up');

			var onSuccess = function() {
				console.log('[SIGNUP+IN] success');
				redirect_signin('/account', req, res);
			}

			keystone.session.signinWithUser(newUser, req, res, onSuccess);
			}
		  // next();
		});

    } else {
        if (res.locals.user ) {
        return res.redirect('/')
      } else {
        view.render('signup');
      }
    }
};
