var keystone = require('keystone');

exports = module.exports = function(req, res) {
  var view = new keystone.View(req, res);
  var locals = res.locals;
  locals.section = 'signinpublic';
  locals.formData = req.body;
  locals.from = req.query.from;

  // function renderView() {
  //   keystone.render(req, res, 'signinpublic', {
  //     submitted: req.body,
  //     from: req.query.from
  //   });
  // }

  // If a form was submitted, process the login attempt
  if (req.method === 'POST') {

    // if (!keystone.security.csrf.validate(req)) {
    //   console.log('There was an error validation');
    //   req.flash('error', 'There was an error with your request, please try again.');
    //   return view.render('signinpublic');
    // }

    if (!req.body.email || !req.body.password) {
      console.log('There was an error password');
      req.flash('error', 'Please enter your email address and password.');
      return view.render('signinpublic');
    }

    var onSuccess = function (user) {

      if (req.query.from && req.query.from.match(/^(?!http|\/\/|javascript).+/)) {
        console.log('match');
        res.redirect(req.query.from);
      } else if ('string' === typeof keystone.get('signinpublic redirect')) {
        console.log('string');
        res.redirect(keystone.get('signinpublic redirect'));
      } else if ('function' === typeof keystone.get('signinpublic redirect')) {
        console.log('function');
        keystone.get('signinpublic redirect')(user, req, res);
      } else {
        console.log('success');
        res.redirect('/account');
      }

    };

    var onFail = function (err) {
      var message = (err && err.message) ? err.message : 'Sorry, that email and password combo are not valid.';
      req.flash('error', message );
      view.render('signinpublic');
    };

    keystone.session.signin(req.body, req, res, onSuccess, onFail);

  } else {
    view.render('signinpublic');
  }

};
