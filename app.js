#!/usr/bin/env node

/**
 * Module dependencies.
 */
// set up ======================================================================
var express  = require('express');
var http  = require('http');
var passport = require('passport');
var passportSocketIo = require('passport.socketio');
var LdapStrategy = require('passport-ldapauth');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var config = require('./server/config/config.js');      // app config file
var RedisStore = require('connect-redis')(session)      // Redis db for session store
var path  = require('path');

var app      = express();                               // create our app w/ express
var server   = http.createServer(app);
var port     = process.env.PORT || 8080;                // set the port
var env      = process.env.NODE_ENV || "development"    // Run in "production" or "development"
console.log('Running in ' + env + ' mode.');
if (env === "development") {
  console.log('+ Login using user:riemann pw:password');
}

// Websocket
var io = require('socket.io')(server);

// For development debugging
var morgan = require('morgan');                         // log requests to the console (express4)
var bodyParser = require('body-parser');                // pull information from HTML POST (express4)
var methodOverride = require('method-override');        // simulate DELETE and PUT (express4)

// configuration ===============================================================

// View Engine
app.set('view engine', 'ejs')
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');
app.engine('.html', require('ejs').renderFile);
app.set('views', path.join(__dirname, 'release'));

// Middleware ==================================================================

// Mongo (for user preference storage)
var mongoose = require('mongoose');

// Use native Node promises
mongoose.Promise = global.Promise;

// connect to MongoDB
mongoose.connect('mongodb://' + config.mongo.server + '/datastore')
  .then(() =>  console.log('Mongo connection succesful'))
  .catch((err) => console.error(err));

// Authentication
var authentication = require('./server/middleware/authentication.js');

// LDAP
if (env === 'production') {
  passport.use(new LdapStrategy(config.ldap));
} else {
  passport.use(new LdapStrategy(config.devldap));
}

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

// Session Data Storage
var sessionStore = new RedisStore(config.redisStore);

app.use(cookieParser(config.session.secret));

// Standard Web Session
app.use(session({
    //name: 'dashboard-session',
    store: sessionStore,
    secret: config.session.secret,
    key: 'express.sid',
    resave: true,
    saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

/*
// Debug session
app.use(function printSession(req, res, next) {
  console.log('req.session', req.session);
  return next();
});
*/

// socket.io Session
io.use(passportSocketIo.authorize({
  cookieParser: cookieParser,          // the same middleware you registrer in express 
  key:          'express.sid',   // the name of the cookie where express/connect stores its session_id 
  secret:       config.session.secret, // the session_secret to parse the cookie 
  store:        sessionStore,          // we NEED to use a sessionstore. no memorystore please 
  success:      onAuthorizeSuccess,    // *optional* callback on success - read more below 
  fail:         onAuthorizeFail,       // *optional* callback on fail/error - read more below 
}));

function onAuthorizeSuccess(data, accept){
  console.log('successful connection to socket.io');
  accept(null, true);
}
 
function onAuthorizeFail(data, message, error, accept){
  if(error)
    throw new Error(message);
  console.log('failed connection to socket.io:', message);
 
  accept(null, false);
}

// routes ======================================================================

// Authentication
var auth = require('./routes/auth')(passport);
app.use(auth);

// Websocket
//require('./routes/websocket')(io);

// Websocket - msgCenter
require('./routes/websocket.msgcenter')(io);

// Websocket - proposals
require('./routes/websocket.proposals')(io);

// Output Logger API
var logger = require('./routes/logger');
app.use('/logger', logger);

// User Storage CRUD API
var userstorage = require('./routes/userstorage');
app.use('/userstorage', userstorage);

// User Dashboard CRUD API
var dashboards = require('./routes/dashboards');
app.use('/dashboards', dashboards);

// User Info
var user = require('./routes/user');
app.use('/user', user);

// Proxy for external APIs (to avoid CORS issues)
var proxy = require('./routes/proxy');
app.use('/proxy', proxy);

// Impala / Cloudera DB query
var impala = require('./routes/impala');
app.use('/impala', impala);

// Dashboard
app.use('/bower_components', express.static(path.join(__dirname, 'bower_components')));
app.use('/styles', express.static(path.join(__dirname, 'release', 'styles')));
app.use('/assets', express.static(path.join(__dirname, 'release', 'assets')));
app.use('/', authentication.isAuthenticated, express.static(path.join(__dirname, 'release')));

// Error Handling ==============================================================
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500).send(err);
});

// listen (start app with node server.js) ======================================
//app.listen(port, '0.0.0.0');
//server.on('upgrade', handleUpgrade(app, wss));
server.listen(port);

console.log("App listening on port " + port);

