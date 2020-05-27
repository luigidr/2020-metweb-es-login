// imports
const express = require('express');
const morgan = require('morgan'); // logging middleware
const dao = require('./dao.js');
const path = require('path');
const passport = require('passport'); // auth middleware
const LocalStrategy = require('passport-local').Strategy; // username and password for login
const session = require('express-session');
//const FileStore = require('session-file-store')(session);

// set up the "username and password" login strategy
// by setting a function to verify username and password
passport.use(new LocalStrategy(
  function(username, password, done) {
    dao.getUser(username, password).then(({user, check}) => {
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!check) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    })
  }
));

// serialize and de-serialize the user (user object <-> session)
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  dao.getUserById(id).then(user => {
    done(null, user);
  });
});

// init express
const app = express();
const port = 3000;

// set up logging
app.use(morgan('tiny'));

// check if a given request is coming from an authenticated user
const isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()){
      return next();
  }
  return res.status(401).json({"statusCode" : 401, "message" : "not authenticated"});
}

// every requests body will be considered as in JSON format
app.use(express.json());

// set up the 'public' component as a static website
app.use(express.static('public'));

// set up the session
app.use(session({
  //store: new FileStore(), // by default, Passport uses a MemoryStore to keep track of the sessions - if you want to use this, launch nodemon with the option: --ignore sessions/
  secret: 'a secret sentence not to share with anybody and anywhere, used to sign the session ID cookie',
  resave: false,
  saveUninitialized: false 
}));

// init passport
app.use(passport.initialize());
app.use(passport.session());


// === REST API (course, exam) === //

// GET /courses
// Get all courses
app.get('/api/courses', isLoggedIn, (req, res) => {
  dao.getAllCourses()
  .then((courses) => res.json(courses))
  .catch(() => res.status(500).end());
});

// GET /exams
// Get all the exams
app.get('/api/exams', isLoggedIn, (req, res) => {
  dao.getAllExams(req.user.id)
  .then((exams) => res.json(exams))
  .catch(() => res.status(500).end());
});

// POST /sessions 
// Login
app.post('/api/sessions', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
      if (err) { return next(err) }
      if (!user) {
          // display wrong login messages
          return res.status(401).json(info);
      }
      // success, perform the login
      req.login(user, function(err) {
        if (err) { return next(err); }
        // req.user contains the authenticated user
        return res.json(req.user.username);
      });
  })(req, res, next);
});

// ALTERNATIVE: if we are not interested in sending error messages...
/*
app.post('/api/sessions', passport.authenticate('local'), (req,res) => {
  // If this function gets called, authentication was successful.
  // `req.user` contains the authenticated user.
  res.json(req.user.username);
});
*/

// DELETE /sessions/current 
// Logout
app.delete('/api/sessions/current', function(req, res){
  req.logout();
  res.end();
});

// every other GET requests need to be handled by the client app
app.get('*', function (request, response) {
  response.sendFile(path.resolve(__dirname, 'public/index.html'));
});

// activate the server
app.listen(port, () => console.log(`Server listening at http://localhost:${port}`));
