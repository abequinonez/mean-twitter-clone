const app = angular
  .module('chirpApp', ['ui.router', 'ngResource'])
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
app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
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

  /*
  Remove hash symbol from URL. The following Stack Overflow post was used as a
  reference: https://stackoverflow.com/a/35787116
  */
  $locationProvider.html5Mode(true);
});

/*
Service for interacting with the posts API. The AngularJS docs and the following
resource were helpful in using the $resource service:
https://www.sitepoint.com/creating-crud-app-minutes-angulars-resource
*/
app.service('postSvc', function($resource) {
  return $resource('/api/posts/:id');
});

app.controller('mainCtrl', function($rootScope, postSvc) {
  const self = this;
  self.posts = [];

  // Get all posts on page load
  getPosts();

  // Add a new post
  self.addPost = function() {
    postSvc
      .save(self.newPost)
      .$promise.then(function() {
        /*
        Reset the form. Use of $setPristine() and $setUntouched() made possible with
        help from the following Stack Overflow post:
        https://stackoverflow.com/a/18648486/9140123
        */
        self.newPost = {};
        self.form.$setPristine();
        self.form.$setUntouched();

        // Get the updated posts
        getPosts();
      })
      .catch(function() {
        console.log('Error saving post');
      });
  };

  /*
  Return a boolean that declares whether or not the post passed in was created
  by the current user.
  */
  self.isPostCreator = function(post) {
    const authenticated = $rootScope.currentUser.authenticated;
    const username = $rootScope.currentUser.username;
    const postCreator = post._creator.username;
    return authenticated && username === postCreator;
  };

  // Set the post to be deleted
  self.setPostToDelete = function(post) {
    self.postToDelete = post;
  };

  // Delete a post
  self.deletePost = function() {
    if (self.postToDelete) {
      postSvc
        .remove({ id: self.postToDelete._id })
        .$promise.then(function() {
          getPosts();
        })
        .catch(function() {
          console.log('Error deleting post');
        });
    }
    self.postToDelete = {};
  };

  /*
  Make a request to get all posts from the server and assign the response to the
  posts array.
  */
  function getPosts() {
    postSvc
      .query()
      .$promise.then(function(res) {
        self.posts = res;
      })
      .catch(function() {
        console.log('Error retrieving posts');
      });
  }
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
