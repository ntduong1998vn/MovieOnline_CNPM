const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require('../models/user')
const keys = require("../config/key")
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const FacebookStrategy = require('passport-facebook').Strategy

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;


module.exports = passport => {

    passport.serializeUser(function (user, done) {
        done(null, user);
    });
    passport.deserializeUser(function (user, done) {
        done(null, user);
    });

    passport.use('jwt',
        new JwtStrategy(opts, (jwt_payload, done) => {
            User.findById(jwt_payload.id)
                .then(user => {
                    if (user) {
                        return done(null, user);
                    }
                    return done(null, false);
                })
                .catch(err => console.log(err));
        })
    );

    passport.use('google', new GoogleStrategy({
        clientID: keys.googleClientID,
        clientSecret: keys.googleClientSecret,
        callbackURL: "http://localhost:8080/auth/google/callback"
    }, (accessToken, refreshToken, profile, done) => {
        const userData = {
            email: profile.emails[0].value,
            name: profile.displayName,
            photo: profile.photos[0].value,
            provider: profile.provider,
            token: accessToken
        };

        done(null, userData);
    }
    ))

    passport.use('facebook', new FacebookStrategy({
        clientID: keys.FACEBOOK_APP_ID,
        clientSecret: keys.FACEBOOK_APP_SECRET,
        callbackURL: "http://localhost:8080/auth/facebook/callback",
        // passReqToCallback: true,
        profileFields: ['id', 'emails', 'name', 'displayName'] //This
    },
        function (accessToken, refreshToken, profile, cb) {
            // User.findOrCreate({ facebookId: profile.id }, function (err, user) {
            //     return cb(err, user);
            // });
            console.log("Facebook Info :", profile);
            const userData = {
                id: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value,
                // photo: profile.photos[0].picture,
                provider: profile.provider,
                token: accessToken
            }
            cb(null, userData);
        }
    ));


};