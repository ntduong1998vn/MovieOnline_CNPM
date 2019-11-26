const express = require('express')
const router = express.Router()
const Genre = require('../models/Genre')

// Url : "api/genres/"
// Get list genres
router.route('/')
    .get((req, res) => {
        Genre.find((error, genres) => {
            if (error)
                return res.status(500).json(error);
            else
                return res.json(genres);
        })
    })
    .post((req, res) => {
        const { id, name } = req.body;
        if (typeof id == 'number' && name !== '') {

            let genre = new Genre({
                id: id,
                name: name
            })

            genre.save(function (err, newGenre) {
                if (err) {
                    if (err.code == 11000) {
                        return res.status(400).send("Trung ID")
                    } else {
                        throw err;
                    }
                }
                res.status(201).json({
                    success: true,
                    message: 'Created Successfully',
                    id: newGenre._id
                })
            })
        }
        else {
            res.status(400).json({
                success: false,
                message: 'Sai dinh dang du lieu!'
            })
        }

    })

router
    .route("/:genreId")
    // GET /api/genres/:genreId
    .get(function (req, res) {
        Genre.findOne({ id: req.params.genreId }, function (err, genre) {
            if (err) {
                return res.send(err);
            }
            res.json(genre);
        });
    })
    // PUT /api/genres/:genreId
    .put(function (req, res) {
        Genre.findOne({ id: req.params.genreId }, function (err, genre) {
            if (err) {
                return res.send(err);
            }

            // Get param in request
            const { id, name } = req.body;
            console.log("*******************");
            console.log(id, " ", name);
            if (id < 0 || name == '') {
                res.status(400).send("Sai dữ liệu đầu vào");
                console.log("******** Genre Post Error ***********");
            }
            else {
                genre.name = name;
                genre.save(function (err) {
                    if (err) {
                        return res.status(400).send(err);
                    }
                    res.json({ message: "Updated succesfully" });
                });
            }
        });
    })
    // DELETE /api/genres/:genreId
    .delete(function (req, res) {
        Genre.deleteOne({ id: req.params.genreId }, function (err, genre) {
            if (err) {
                return res.send(err);
            }
            res.json({ message: "Deleted successfully!" });
        });
    });

module.exports = router
