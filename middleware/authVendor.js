var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');
var Vendor = require('../models/vendor');

passport.serializeUser(Vendor.serializeUser());
passport.deserializeUser(Vendor.deserializeUser());
passport.use(
	'local-ven',
	new LocalStrategy(
		{
			usernameField: 'email',
		},
		Vendor.authenticate()
	)
);

exports.getToken = function (user) {
	return jwt.sign(user, process.env.SECRET);
};

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET;

passport.use(
	'jwt-ven',
	new JwtStrategy(opts, async (jwt_payload, done) => {
		try {
			const user = await Vendor.findOne({ _id: jwt_payload._id });
			if (user) {
				return done(null, user);
			} else {
				return done(null, false);
			}
		} catch (error) {
			return error, false;
		}
	})
);

exports.verifyVendor = passport.authenticate('jwt-ven', { session: false });
