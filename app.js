// All passport calls were suggested by the passport readme.

var express          = require('express');
var path             = require('path');
var passport         = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy   = require('passport-google-oauth').OAuth2Strategy;
var TwitterStrategy  = require('passport-twitter').Strategy;
var favicon          = require('serve-favicon');
var logger           = require('morgan');
var cookieParser     = require('cookie-parser');
var bodyParser       = require('body-parser');
var session          = require('express-session')
var mongoose         = require('mongoose');

var routes     = require('./routes/router');
// var db         = require('./models/db');
// var models     = require('./models/models');
var configAuth = require('./config/auth');
// var userHelper = require('./utils/user');

var app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Set up express
// Uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret : 'keyboard bird', 
                  resave: false,
                  saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());

// Tell app to use routes file
app.use('/', routes);

////////////////////
// PASSPORT SETUP //
////////////////////

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Facebook profile is serialized
//   and deserialized.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});



/////////////////////////////
// FACEBOOK AUTHENTICATION //
/////////////////////////////

passport.use(new FacebookStrategy({
    clientID:     configAuth.facebookAuth.clientID,
    clientSecret: configAuth.facebookAuth.clientSecret,
    callbackURL:  configAuth.facebookAuth.callbackURL,
    passReqToCallback: true
  },
  function(req, accessToken, refreshToken, profile, done) {
    // Verify asynchronously
    process.nextTick(function() {
      // Check user table for existing user with this id
      models.User.findOne({
          'userId': profile.provider.charAt(0) + profile.id.toString()
      }, function(err, user) {
        if (err) {
          return done(err);
        }
        // No user was found, so create a new user with values from the profile
        if (!user) {
          req.newUser = true;
          userHelper.addNewUser(profile, done);
        } else {
          req.newUser = false;
          // Found user, return it
          return done(err, user);
        }
      });
    });
  }
));

// GET /auth/facebook
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Facebook authentication will involve
//   redirecting the user to facebook.com.  After authorization, Facebook will
//   redirect the user back to this application at /auth/facebook/callback
app.get('/auth/facebook',
  passport.authenticate('facebook', { scope: ['email'] }),
  function(req, res){
    // The request will be redirected to Facebook for authentication, so this
    // function will not be called.
  });

// GET /auth/facebook/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which currently goes to registration.
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication
    if (req.newUser) {
      res.redirect('/register'); // Redirect to registration page for new users
    } else {
      res.redirect('/pending'); // Redirect to pending page for returning users
    }
  });

// ////////////////////////////
// // GOOGLE+ AUTHENTICATION //
// ////////////////////////////

// // Use the GoogleStrategy within Passport.
// //   Strategies in Passport require a `verify` function, which accept
// //   credentials (in this case, an accessToken, refreshToken, and Google
// //   profile), and invoke a callback with a user object.
// passport.use(new GoogleStrategy({
//     clientID:     configAuth.googleAuth.clientID,
//     clientSecret: configAuth.googleAuth.clientSecret,
//     callbackURL:  configAuth.googleAuth.callbackURL,
//     passReqToCallback: true
//   },
//   function(req, accessToken, refreshToken, profile, done) {
//     // Verify asynchronously
//     process.nextTick(function() {
//       // Check user table for existing user with this id
//       models.User.findOne({
//         'userId': profile.provider.charAt(0) + profile.id.toString()
//       }, function(err, user) {
//         if (err) {
//           return done(err);
//         }
//         // No user was found, so create a new user with values from the profile
//         if (!user) {
//           req.newUser = true;
//           userHelper.addNewUser(profile, done);
//         } else {
//           req.newUser = false;
//           // Found user, return it
//           return done(err, user);
//         }
//       });
//     });
//   }
// ));

// // GET /auth/google
// //   Use passport.authenticate() as route middleware to authenticate the
// //   request.  The first step in Google authentication will involve
// //   redirecting the user to google.com.  After authorization, Google
// //   will redirect the user back to this application at /auth/google/callback
// app.get('/auth/google',
//   passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.profile',
//                                             'https://www.googleapis.com/auth/userinfo.email'] }),
//   function(req, res){
//     // The request will be redirected to Google for authentication, so this
//     // function will not be called.
//   });

// // GET /auth/google/callback
// //   Use passport.authenticate() as route middleware to authenticate the
// //   request.  If authentication fails, the user will be redirected back to the
// //   login page.  Otherwise, the primary route function function will be called,
// //   which, in this example, will redirect the user to the home page.
// app.get('/auth/google/callback', 
//   passport.authenticate('google', { failureRedirect: '/' }),
//   function(req, res) {
//     // Successful authentication
//     if (req.newUser) {
//       res.redirect('/register'); // Redirect to registration page for new users
//     } else {
//       res.redirect('/pending'); // Redirect to pending page for returning users
//     }
//   });

// ////////////////////////////
// // TWITTER AUTHENTICATION //
// ////////////////////////////

// // Use the TwitterStrategy within Passport.
// //   Strategies in passport require a `verify` function, which accept
// //   credentials (in this case, a token, tokenSecret, and Twitter profile), and
// //   invoke a callback with a user object.
// passport.use(new TwitterStrategy({
//     consumerKey:       configAuth.twitterAuth.consumerKey,
//     consumerSecret:    configAuth.twitterAuth.consumerSecret,
//     callbackURL:       configAuth.twitterAuth.callbackURL,
//     passReqToCallback: true
//   },
//   function(req, token, tokenSecret, profile, done) {
//     // Verify asynchronously
//     process.nextTick(function () {
//       // Check user table for existing user with this id
//       models.User.findOne({
//           'userId': profile.provider.charAt(0) + profile.id.toString()
//       }, function(err, user) {
//         if (err) {
//           return done(err);
//         }
//         // No user was found, so create a new user with values from the profile
//         if (!user) {
//           req.newUser = true;
//           userHelper.addNewUser(profile, done);
//         } else {
//           req.newUser = false;
//           // Found user, return it
//           return done(err, user);
//         }
//       });
//     });
//   }
// ));

// // GET /auth/twitter
// //   Use passport.authenticate() as route middleware to authenticate the
// //   request.  The first step in Twitter authentication will involve redirecting
// //   the user to twitter.com.  After authorization, the Twitter will redirect
// //   the user back to this application at /auth/twitter/callback
// app.get('/auth/twitter',
//   passport.authenticate('twitter'),
//   function(req, res){
//     // The request will be redirected to Twitter for authentication, so this
//     // function will not be called.
//   });

// // GET /auth/twitter/callback
// //   Use passport.authenticate() as route middleware to authenticate the
// //   request.  If authentication fails, the user will be redirected back to the
// //   login page.  Otherwise, the primary route function function will be called,
// //   which, in this example, will redirect the user to the home page.
// app.get('/auth/twitter/callback', 
//   passport.authenticate('twitter', { failureRedirect: '/' }),
//   function(req, res) {
//     // Successful authentication
//     if (req.newUser) {
//       res.redirect('/register'); // Redirect to registration page for new users
//     } else {
//       res.redirect('/pending'); // Redirect to pending page for returning users
//     }
//   });

// app.get('/passport-logout', function(req, res){
//   req.logout();
//   res.redirect('/');
// });

// ////////////////////
// // ERROR HANDLERS //
// ////////////////////

// // Handle 404 errors
// app.use(function(req, res, next) {
//     res.status(404);

//     // Respond with html page if possible
//     if (req.accepts('html')) {
//         res.render('404', { url: req.url });
//         return;
//     }

//     // Respond with JSON
//     if (req.accepts('json')) {
//         res.send({ error: 'Page not found' });
//         return;
//     }

//     // Default to plain-text
//     res.type('txt').send('Page not found');
// });

// // Handle 500 errors
// app.use(function(err, req, res, next) {
//     res.status(err.status || 500);

//     // Respond with html page if possible
//     if (req.accepts('html')) {
//         res.render('500', { error: err });
//         return;
//     }

//     // Respond with JSON
//     if (req.accepts('json')) {
//         res.send({ error: err });
//         return;
//     }

//     // Default to plain-text
//     res.type('txt').send('Internal server error');
// });

// // Development error handler
// // Will print stacktrace
// if (app.get('env') === 'development') {
//     app.use(function(err, req, res, next) {
//         res.status(err.status || 500);
//         res.render('error', {
//             message: err.message,
//             error: err
//         });
//     });
// }

// // Production error handler
// // No stacktraces leaked to user
// app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//         message: err.message,
//         error: {}
//     });
// });

/////////////
// EXPORTS //
/////////////

module.exports = app;