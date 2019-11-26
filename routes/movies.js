const express = require('express')
const router = express.Router()
const Movie = require('../models/Movie')

// Url : "api/movies/"
// Get list movies
router.get('/', (req, res) => {
    Movie.find((error, movies) => {
        if (error)
            return res.json(error)
        else
            return res.json(movies);
    })
})

router.get('/feature', (req, res) => {
    const result = Movie.aggregate().sample(12).exec((err, rs) => {
        res.json(rs);
    });
})

router
    .route("/:movieId")
    // GET /api/movies/:movieId
    .get(function (req, res) {
        Movie.findOne({ id: req.params.movieId }, function (err, movie) {
            if (err) {
                return res.send(err);
            }
            res.json(movie);
        });
    })
    // PUT /api/movies/:movieId
    .put(function (req, res) {
        Movie.findOne({ id: req.params.movieId }, function (err, movie) {
            if (err) {
                return res.send(err);
            }

            movie.save(function (err) {
                if (err) {
                    return res.send(err);
                }
                res.json({ message: "Updated succesfully" });
            });
        });
    })
    // DELETE /api/movies/:movieId
    .delete(function (req, res) {
        Movie.remove({ id: req.params.movieId }, function (err, movie) {
            if (err) {
                return res.send(err);
            }
            res.json({ message: "Deleted successfully!" });
        });
    });




module.exports = router
