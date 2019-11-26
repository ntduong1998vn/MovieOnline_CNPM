const express = require('express')
const router = express.Router()
const passport = require('../passport')


router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/", session: false }),
    function (req, res) {
        var token = req.user.token;
        res.redirect("http://localhost:3000/oauth2?token=" + token);
    }
);
router.get("/facebook", passport.authenticate('facebook', { scope: ["email"] }));

router.get(
    "/facebook/callback",
    passport.authenticate('facebook', { failureRedirect: '/error', session: false }),
    function (req, res) {
        var token = req.user.token;
        res.redirect("http://localhost:3000/oauth2?token=" + token);
    })

module.exports = router;