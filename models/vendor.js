var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
var Schema = mongoose.Schema;

var Vendor = new Schema(
	{
		name: {
			type: String,
			default: '',
		},
		email: { type: String, default: '' },
		phone_number: {
			type: String,
			default: '',
		},
		description: {
			type: String,
			default: '',
		},
		address: { type: String, default: '' },
		picture: { type: String, default: '' },
	},
);

Vendor.plugin(passportLocalMongoose, {
	usernameField: 'email',
});

module.exports = mongoose.model('Vendor', Vendor);
