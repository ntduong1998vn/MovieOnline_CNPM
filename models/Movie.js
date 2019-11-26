const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
    popularity: Number,
    vote_count: Number,
    video: Boolean,
    poster_path: String,
    adult: Boolean,
    backdrop_path: String,
    original_language: String,
    original_title: String,
    genre_ids: Array,
    title: String,
    vote_average: Number,
    overview: String,
    release_date: String,
    id: Number
})

module.exports = mongoose.model('Movie', MovieSchema, 'movies');