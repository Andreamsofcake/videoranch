var keystone = require('keystone');
var middleware = require('./middleware');
var importRoutes = keystone.importer(__dirname);

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);
keystone.pre('routes', middleware.init);

// Import Route Controllers
var routes = {
	views: importRoutes('./views'),
};

// Setup Route Bindings
exports = module.exports = function (app) {
	// Views
	app.get('/', routes.views.index);
	app.all('/signup', keystone.security.csrf.middleware.init, routes.views.signup);
	app.all('/signout', keystone.security.csrf.middleware.init, routes.views.signout);
	app.all('/account', middleware.requireUser, routes.views.account);
	app.all('/signin', keystone.security.csrf.middleware.init, routes.views.signin);

};
