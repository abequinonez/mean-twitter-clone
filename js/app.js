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
