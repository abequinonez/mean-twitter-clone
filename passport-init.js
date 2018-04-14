const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// Import the User model
const { User } = require('./models/user');

module.exports = function(passport) {
  // Serialize the authenticated user to the session
  passport.serializeUser((user, done) => done(null, user._id));

  // Deserialize the user for subsequent requests
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .then(user => {
        if (!user) {
          return done(null, false);
        }

        return done(null, user);
      })
      .catch(err => done(err, false));
  });

  passport.use(
    'register',
    new LocalStrategy(
      { passReqToCallback: true },
      (req, username, password, done) => {
        // First check if the user already exists
        User.findOne({ username })
          .then(user => {
            // If user exists, return an error
            if (user) {
              return done(
                null,
                false,
                req.flash('error', 'Username already taken')
              );
            }

            // Otherwise, create a new user
            const newUser = new User({
              username,
              password: hashPassword(password)
            });

            // Save user to the DB and return new user object
            return newUser.save().then(user => done(null, user));
          })
          .catch(err => done(err, false));
      }
    )
  );

  passport.use(
    'login',
    new LocalStrategy(
      { passReqToCallback: true },
      (req, username, password, done) => {
        User.findOne({ username })
          .then(user => {
            // Check if user exists and if password is correct
            if (!user || !isValidPassword(user, password)) {
              return done(
                null,
                false,
                req.flash('error', 'Invalid credentials')
              );
            }

            return done(null, user);
          })
          .catch(err => done(err, false));
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
