const app = angular.module('chirpApp', []);

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
