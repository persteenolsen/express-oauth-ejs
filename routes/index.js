//'use strict';

const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/', (req, res, next) => {
   
   const { user } = req;

    if( user ){
      
       // sub is the same as the id received from Google Oaut server
       console.log( "sub: " + user._json.sub );

       // console.log( "name: " + user._json.name );
       console.log( "given_name: " + user._json.given_name );
       console.log( "famiily_name: " + user._json.family_name );

       console.log( "email: " +  user._json.email );
       console.log( "email_verified: " +  user._json.email_verified );
       console.log( "locale: " +  user._json.locale );
       console.log( "picture: " +  user._json.picture );
          
       
      // TEST - Session could be used to display a protected view if loggedin
      // and a public view if not ogged in 
       req.session.loggedin = 'true';
       console.log( "Session in router: google profil: " +  req.session.loggedin );
          
     }    
    
     
     // Parsing the Google User to the View
     res.render('profile', { user });
   
});



// About
router.get('/about', (req, res, next) => {
    
  // TEST - Session could be used to display a protected view if loggedin
  // and a public view if not ogged in 
  console.log( "Session in router: about: " +  req.session.loggedin );
  
  const { user } = req;
  //console.log( "User: " + user );

  res.render('about', { user }); 
   
 
});


// Protected
router.get('/protected', (req, res, next) => {
  
  // TEST - Session could be used to display a protected view if loggedin
  // and a public view if not ogged in 
  console.log( "Session in router: protected: " +  req.session.loggedin );
  
  const { user } = req;
  //console.log( "User: " + user );

  res.render('protected', { user }); 
   
 
});



// Logging out of Google and redirect to root
router.get('/logout', (req, res, next) => {
  
     // TEST - Session
     req.session.destroy( function( error ){ 
        console.log("Session Destroyed");
    }) 
    

  req.logout();
  res.redirect('/');

});


// Try to get the Google profile and the email if authenticated at Google Oaut server
router.get('/login/google', passport.authenticate('google', { scope: ['profile', 'email'] } ));


// Authenticated at Google Oaut server and getting the request from the Google App
router.get('/responsefromoauth', passport.authenticate('google', { failureRedirect: '/' }),
  (req, res, next) => {
    
    console.log('Return');

    // Just redirect to profile router
    res.redirect('/');
   
});

module.exports = router;