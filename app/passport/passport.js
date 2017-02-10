// LOGIN WITH FACEBOOK, TWITTER $ GOOGLE+

var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy  = require('passport-twitter').Strategy;
var GoogleStrategy   = require('passport-google-oauth').OAuth2Strategy;
var User 			       = require('../models/user'); // import user model
var session			     = require('express-session');
var jwt				       = require('jsonwebtoken'); // login user 
var secret			     = 'diplomovka';


// module file to server file
module.exports	= function(app, passport) {

  app.use(passport.initialize());
  app.use(passport.session());
  app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: true, cookie: {secure: false}}));

  passport.serializeUser(function(user, done) {
	token = jwt.sign({ username: user.username, email: user.email }, secret , { expiresIn: '24h' }); // after 24h token will not be longer usable
  	done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
 	 User.findById(id, function(err, user) {
    	done(err, user);
 	 });
	});

// LOGIN WITH FACEBOOK
	passport.use(new FacebookStrategy({
    clientID: '347276662338731',
    clientSecret: '36feb451460e6a3d4dcbd63921f30100',
    callbackURL: "http://localhost:8080/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'photos', 'email']
  },
  function(accessToken, refreshToken, profile, done) {
  	User.findOne({ email: profile._json.email }).select('username password email').exec(function(err, user){
  		if (err) done(err);

  		if (user && user != null){
  			done(null, user);  		
  		} else {
  			done(err);
  		}
  	});
  }
));

// LOGIN WITH TWITTER
passport.use(new TwitterStrategy({
    consumerKey: 'kATnu8l39tQHV4yGMKoe3sxSN',
    consumerSecret: 'Usx6US6kKZJdAdDWMaDSnu2OnfLv8m3JkxP3zaBTV3VOQ5R4f4',
    callbackURL: "http://localhost:8080/auth/twitter/callback",
    userProfileURL: "https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true"
  },
  function(token, tokenSecret, profile, done) {
    User.findOne({ email: profile.emails[0].value }).select('username password email').exec(function(err, user){ // email: profile.emails[0].value <- in console only email
      if (err) done(err);

      if (user && user != null){
        done(null, user);     
      } else {
        done(err);
      }
    });
  }
));

// LOGIN WITH GOOGLE ACCOUNT
passport.use(new GoogleStrategy({
    clientID: '51159396974-g17mtg0l4k2k74oobmhul7ritkq4hk4e',
    clientSecret: 'vkqE5QPZa9o70ej9nRkPmrSi',
    callbackURL: "http://localhost:8080/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOne({ email: profile.emails[0].value }).select('username password email').exec(function(err, user){ // email: profile.emails[0].value <- in console only email
          if (err) done(err);

          if (user && user != null){
            done(null, user);     
          } else {
            done(err);
          }
        });
  }
));

  app.get('/auth/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login', 'profile', 'email'] }));

  app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/googleerror' }), function(req, res) {
    res.redirect('/google/' + token);
  });

  app.get('/auth/twitter', passport.authenticate('twitter'));

  app.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/twittererror' }), function(req, res) {
    res.redirect('/twitter/' + token);
  });

	app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/facebookerror' }), function(req, res) {
		res.redirect('/facebook/' + token);
	});

	app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

	return passport;

};
