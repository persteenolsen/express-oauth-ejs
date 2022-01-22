
require('rootpath')();
const express = require('express');
const app = express();

const cors = require('cors');
const bodyParser = require('body-parser');
const errorHandler = require('_helpers/error-handler');

// Note: The port 8080 is also working on Azure with HTTPS enabled on Azure
var http = require('http');
var port = process.env.PORT || 443;

const path = require('path');
require('dotenv').config();

const passport = require('passport');
const { Strategy } = require('passport-google-oauth20');
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, SESSION_SECRET } =  process.env;

// Note: Needed for http://localhost !!
// The "Referrer-Policy" may not be used at Azure !!
const referrerPolicy = require('referrer-policy')

// Sets "Referrer-Policy: no-referrer"
app.use( referrerPolicy({ policy: 'no-referrer' }))

app.use( bodyParser.urlencoded({ extended: true }));
app.use( bodyParser.json());

// Allowing request from all origins according to the cors policy 
//app.use(cors());


// Creating the Passport strategy
passport.use(new Strategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    
    // DEVELOPEMENT: A HTTP localhost is needed here and needs to match the HTTP localhost URL at
    // callbackURL: 'http://localhost:443/responsefromoauth'
    // NOTE: This uri may work for developement too
    // callbackURL: '/responsefromoauth'

   // PRODUCTION / AZURE: An URL with HTTPS is needed here ! It needs to match the HTTPS URL at
    callbackURL: 'https://pso-express-auth-ejs-goog.azurewebsites.net/responsefromoauth'
  },

  (accessToken, refreshToken, profile, cb) => {
    return cb(null, profile);
}));

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((obj, cb) => {
  cb(null, obj);
}); 

app.set('view engine', 'ejs');

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/views', express.static(path.join(__dirname, 'views')));


// Initializing the session cookie with options
// HttpOnly is set by default 
var session = require('express-session');
app.use( session (
  {
    name: "AuthCookie",
    secret: SESSION_SECRET, 
    resave: true, 
    saveUninitialized: true
   // cookie: {
    
    // httpOnly: true,
    // SameSite:"None"
    // secure: true
    // maxAge  : 60 * 60 * 1000 
    // } 
  }
  ));

app.use( passport.initialize() );
app.use( passport.session() );


const routes = require('./routes');
app.use('/', routes);


// Just a test for localhost:443/test
app.get('/test', function (req, res) {
    res.send('Hello World - Sign in with your Google Account !');
   // console.log('Test');
 })
 


// global error handler
app.use( errorHandler );


app.listen(port, function(){
	console.log('Server running at port 443')
})
