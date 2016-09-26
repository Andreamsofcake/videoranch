var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */
var User = new keystone.List('User');

User.add({
	name: { type: Types.Name, required: true, index: true },
	email: { type: Types.Email, initial: true, required: true, index: true },
	username: {type: String, initial: true, required: true, index: true, unique: true },
	mobile_phone: { type: Number, initial: true, index: true },
	image: { type: Types.CloudinaryImage },
	password: { type: Types.Password, initial: true, required: true },
	profile: { type: Types.Html, wysiwyg: true, height: 150 }
}, 'Permissions', {
	isAdmin: { type: Boolean, label: 'Can access Keystone', index: true },
});

// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function () {
	return this.isAdmin;
});


/**
 * Registration
 */
User.defaultColumns = 'name, email, isAdmin';
User.register();
