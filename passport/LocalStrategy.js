const User = require('../models/user')
const LocalStrategy = require('passport-local').Strategy

const strategy = new LocalStrategy(
    {
        usernameField: 'email',
        // passReqToCallback: true
    },
    function (email, password, done) {
        console.log(' *********** LocalStrategy *************');
        console.log(email, " ", password);
        User.findOne({ email: email }, (err, user) => {
            if (err) {
                return done(err)
            }
            if (!user) {
                return done(null, false, { message: 'Incorrect email' })
            }
            if (!user.checkPassword(password)) {
                return done(null, false, { message: 'Incorrect password' })
            }
            return done(null, user)
        })
    }
)

module.exports = strategy