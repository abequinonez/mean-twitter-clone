const express = require('express');
const router = express.Router();
const { ObjectID } = require('mongodb');

// Import the Post model
const { Post } = require('./../models/post');

// Router-level middleware for authenticating non-GET routes
router.use((req, res, next) => {
  // Only proceed if a GET route is requested or if the user is authenticated
  if (req.method === 'GET' || req.isAuthenticated()) {
    return next();
  }

  // Otherwise, redirect the user to the AngularJS app login page
  return res.redirect('/#login');
});

router
  .route('/posts')

  // Get all posts
  .get((req, res) => {
    Post.find()
      .then(posts => res.send(posts))
      .catch(err => res.status(500).send());
  })

  // Add a new post
  .post((req, res) => {
    // First prepare the _creator object
    const _creator = {
      id: req.user._id,
      username: req.user.username
    };

    // Next create an instance of the Post model
    const post = new Post({ text: req.body.text, _creator });

    // Now save the instance (document) to the database
    post
      .save()
      .then(post => res.send(post))
      .catch(err => res.status(500).send());
  });

router
  .route('/posts/:id')

  // Get a post (if it exists)
  .get((req, res) => {
    // Store the ID in a constant
    const id = req.params.id;

    // Check if the ID passed in is valid
    if (!ObjectID.isValid(id)) {
      return res.status(404).send();
    }

    Post.findById(id)
      .then(post => {
        if (!post) {
          return res.status(404).send();
        }

        return res.send(post);
      })
      .catch(err => res.status(500).send());
  })

  // Update an existing post
  .put((req, res) => {
    const id = req.params.id;

    if (!ObjectID.isValid(id)) {
      return res.status(404).send();
    }

    // Prepare the _creator object
    const _creator = {
      id: req.user._id,
      username: req.user.username
    };

    Post.findOneAndUpdate(
      { _id: id, _creator },
      { $set: { text: req.body.text } },
      { new: true }
    )
      .then(post => {
        if (!post) {
          return res.status(404).send();
        }

        return res.send(post);
      })
      .catch(err => res.status(500).send());
  })

  // Delete an existing post
  .delete((req, res) => {
    const id = req.params.id;

    if (!ObjectID.isValid(id)) {
      return res.status(404).send();
    }

    // Prepare the _creator object
    const _creator = {
      id: req.user._id,
      username: req.user.username
    };

    Post.findOneAndRemove({ _id: id, _creator })
      .then(post => {
        if (!post) {
          return res.status(404).send();
        }

        return res.send(post);
      })
      .catch(err => res.status(500).send());
  });

module.exports = router;
