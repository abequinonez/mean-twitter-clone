const express = require('express');
const router = express.Router();

router
  .route('/posts')

  // Get all posts
  .get((req, res) => {
    // Placeholder until database is set up
    res.send({ message: 'TODO: Get all posts' });
  })

  // Add a new post
  .post((req, res) => {
    // Placeholder until database is set up
    res.send({ message: 'TODO: Add a new post' });
  });

router
  .route('/posts/:id')

  // Get a post
  .get((req, res) => {
    res.send({ message: `TODO: Get post with ID of ${req.params.id}` });
  })

  // Update an existing post
  .put((req, res) => {
    res.send({ message: `TODO: Update post with ID of ${req.params.id}` });
  })

  // Delete an existing post
  .delete((req, res) => {
    res.send({ message: `TODO: Delete post with ID of ${req.params.id}` });
  });

module.exports = router;
