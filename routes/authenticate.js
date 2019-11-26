const express = require('express')
const router = express.Router()
const User = require('../models/user')
const passport = require('../passport')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const keys = require("../config/key")

// Load input validation
const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");


router.post('/register', (req, res) => {
    console.log('Access to register');

    const { errors, isValid } = validateRegisterInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    const { name, email, password, provider } = req.body
    // ADD VALIDATION
    User.findOne({ email: email })
        .then(user => {
            if (user) {
                return res.status(400).json({ email: "Email already exists" });
            } else {
                const newUser = new User({
                    email: email,
                    password: password,
                    name: name,
                    provider: provider
                })
                newUser.save()
                    .then(user => res.status(201).json(user))
                    .catch(err => console.log(err))
            }
        })
        .catch(err => console.log(err))
})

router.get('/', (req, res, next) => {
    console.log('===== user!!======')
    console.log(req.user)
    if (req.user) {
        res.json({ user: req.user })
    } else {
        res.json({ user: null })
    }
})

router.post(
    '/login',
    function (req, res, next) {
        console.log('Login Request Body : ', req.body);
        next()
    }, (req, res) => {
        const { errors, isValid } = validateLoginInput(req.body);

        // Check validation
        if (!isValid) {
            return res.status(400).json(errors);
        }

        const { email, password } = req.body
        User.findOne({ email }).then(user => {
            // Check if user exists
            if (!user) {
                return res.status(404).json({ emailnotfound: "Email not found" });
            }
            // CHeck password
            if (user.checkPassword(password)) {
                // User matched
                // Create JWT Payload
                const payload = {
                    id: user.id,
                    name: user.name
                };
                // Sign token
                jwt.sign(
                    payload,
                    keys.secretOrKey,
                    {
                        expiresIn: 3600 // 1 hour in seconds
                    },
                    (err, token) => {
                        res.json({
                            success: true,
                            token: "Bearer " + token
                        });
                    }
                );
            } else {
                return res.status(400).json({ passwordincorrect: "Password incorrect" });
            }
        });
    });

router.post('/logout', (req, res) => {
    if (req.user) {
        req.logout()
        res.send({ msg: 'logging out' })
    } else {
        res.send({ msg: 'no user to log out' })
    }
})

module.exports = router