const express = require('express');
const router = express.Router();

module.exports = function(passport) {
  // Send success login state back to AngularJS
  router.get('/success', (req, res) => {
    res.send({ state: 'success', user: req.user ? req.user : null });
  });

  // Send failure login state back to AngularJS
  router.get('/failure', (req, res) => {
    res.send({
      state: 'failure',
      user: null,
      message: req.flash('error')[0]
    });
  });

  // Register
  router.post(
    '/register',
    passport.authenticate('register', {
      successRedirect: '/auth/success',
      failureRedirect: '/auth/failure',
      failureFlash: true
    })
  );

  // Log in
  router.post(
    '/login',
    passport.authenticate('login', {
      successRedirect: '/auth/success',
      failureRedirect: '/auth/failure',
      failureFlash: true
    })
  );

  // Log out
  router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

  // Get user authentication status
  router.get('/status', (req, res) => {
    const authenticated = req.isAuthenticated();
    res.send({ authenticated, user: req.user });
  });

  return router;
};
