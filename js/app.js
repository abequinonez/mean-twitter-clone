const app = angular.module('chirpApp', ['ui.router']);

// Configure routing using UI-Router
app.config(function($stateProvider, $urlRouterProvider) {
  // In case of an invalid route, navigate to the root route
  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('main', {
      url: '/',
      templateUrl: 'main.html',
      controller: 'mainCtrl as ctrl'
    })
    .state('register', {
      url: '/register',
      templateUrl: 'register.html',
      controller: 'authCtrl as ctrl'
    })
    .state('login', {
      url: '/login',
      templateUrl: 'login.html',
      controller: 'authCtrl as ctrl'
    });
});

app.controller('mainCtrl', function() {
  const self = this;
  self.posts = [];

  // Add a new post to the array of posts
  self.addPost = function() {
    self.newPost.createdAt = Date.now();
    self.posts.push(self.newPost);

    /*
    Reset the form. Use of $setPristine() and $setUntouched() made possible with
    help from the following Stack Overflow post:
    https://stackoverflow.com/a/18648486/9140123
    */
    self.newPost = {};
    self.form.$setPristine();
    self.form.$setUntouched();
  };
});

app.controller('authCtrl', function() {
  const self = this;

  // Register a user
  self.register = function() {
    // Placeholder until backend is set up
    self.errorMessage = `Registration request for ${self.user.username}`;
  };

  // Log in a user
  self.login = function() {
    // Placeholder until backend is set up
    self.errorMessage = `Login request for ${self.user.username}`;
  };
});
