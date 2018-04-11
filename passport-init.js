const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// Temporary data store
const users = {};

module.exports = function(passport) {
  // Serialize the authenticated user to the session
  passport.serializeUser((user, done) => {
    console.log('Serializing user:', user.username);
    return done(null, user.username);
  });

  // Deserialize the user for subsequent requests
  passport.deserializeUser((username, done) => {
    return done(null, users[username]);
  });

  passport.use(
    'register',
    new LocalStrategy(
      { passReqToCallback: true },
      (req, username, password, done) => {
        // First check if the user already exists
        if (users[username]) {
          return done(
            null,
            false,
            req.flash('error', 'Username already taken')
          );
        }

        // Save user to the DB
        users[username] = {
          username,
          password: hashPassword(password)
        };

        return done(null, users[username]);
      }
    )
  );

  passport.use(
    'login',
    new LocalStrategy(
      { passReqToCallback: true },
      (req, username, password, done) => {
        // Check if user exists and if password is correct
        if (!users[username] || !isValidPassword(users[username], password)) {
          return done(null, false, req.flash('error', 'Invalid credentials'));
        }

        return done(null, users[username]);
      }
    )
  );

  // Use bcrypt.js to hash the password
  const hashPassword = password => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  };

  // Use bcrypt.js to check if the password is correct
  const isValidPassword = (user, password) => {
    return bcrypt.compareSync(password, user.password);
  };
};
