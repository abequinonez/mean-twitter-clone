const app = angular
  .module('chirpApp', ['ui.router'])
  .run(function($rootScope, $http) {
    $rootScope.currentUser = {};
    getUserStatus();

    /*
    Log out a user. Make a logout request to the backend and reset the user's
    authentication status on the frontend.
    */
    $rootScope.logout = function() {
      $http
        .get('/auth/logout')
        .then(function() {
          resetAuthStatus();
        })
        .catch(function() {
          console.log('Error making request');
        });
    };

    // Set user's status to authenticated
    $rootScope.setAuthStatus = function(username) {
      $rootScope.currentUser.authenticated = true;
      $rootScope.currentUser.username = username;
    };

    // Reset user's authentication status
    function resetAuthStatus() {
      $rootScope.currentUser.authenticated = false;
      $rootScope.currentUser.username = '';
    }

    /*
    Check to see if a user is logged in on the backend. If so, set the user's
    status to authenticated. Otherwise, reset the user's status.
    */
    function getUserStatus() {
      $http
        .get('/auth/status')
        .then(function(res) {
          if (res.data.authenticated) {
            return $rootScope.setAuthStatus(res.data.user.username);
          }

          return resetAuthStatus();
        })
        .catch(function() {
          console.log('Error contacting server');
          return resetAuthStatus();
        });
    }
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

// Service for getting all posts from the server
app.service('postSvc', function($http) {
  this.getAll = function() {
    return $http.get('/api/posts');
  };
});

app.controller('mainCtrl', function(postSvc) {
  const self = this;

  /*
  Make a request to get all posts from the server and assign the response to the
  posts array.
  */
  postSvc
    .getAll()
    .then(function(res) {
      self.posts = res.data;
    })
    .catch(function() {
      console.log('Error retrieving posts');
    });

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
          $rootScope.setAuthStatus(res.data.user.username);
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
