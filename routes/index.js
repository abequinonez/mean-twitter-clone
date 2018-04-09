const express = require('express');
const router = express.Router();

// Show the AngularJS app home page
router.get('/', (req, res) => {
  res.render('index');
});

module.exports = router;
