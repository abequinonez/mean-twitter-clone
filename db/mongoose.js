const mongoose = require('mongoose');

const dbUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017/ChirpApp';

// Use native promises
mongoose.Promise = global.Promise;
mongoose.connect(dbUrl);

module.exports = { mongoose };
