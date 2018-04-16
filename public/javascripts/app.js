const app = angular
  .module('chirpApp', ['ui.router'])
  .run(function($rootScope, $http) {
    $rootScope.logout = function() {
      $http
        .get('/auth/logout')
        .then(function() {
          $rootScope.authenticated = false;
          $rootScope.currentUser = '';
        })
        .catch(function() {
          console.log('Error making request');
        });
    };
  });

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

app.controller('authCtrl', function($rootScope, $http, $location) {
  const self = this;

  // Register a user
  self.register = function() {
    authenticate('register');
  };

  // Log in a user
  self.login = function() {
    authenticate('login');
  };

  // Authenticate a user after registering or logging in
  function authenticate(type) {
    $http
      .post('/auth/' + type, self.user)
      .then(function(res) {
        if (res.data.state === 'success') {
          $rootScope.authenticated = true;
          $rootScope.currentUser = res.data.user.username;
          $location.path('/');
        } else {
          self.errorMessage = res.data.message;
        }
      })
      .catch(function() {
        self.errorMessage = 'Error making request';
      });
  }
});
