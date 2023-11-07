// controllers/hello.route.js
const express = require('express');
const router = express.Router();

router.get('/my/:name', mynameAction);
router.get('/myy', mynameAction);
async function mynameAction(request, response) {
    response.send("MYNAME ACTION "+request.params.name);
}

// http://localhost:9000/browse/anime
router.get('/anime', (req, res) => {
    //res.send('Hello, from controller...');
    res.render('browse/browse_anime', { favourites: [] });
});

// http://localhost:9000/browse/manga
router.get('/manga', (req, res) => {
    //res.send('Hello, from controller...');
    res.render('browse/browse_manga', { favourites: [] });
});

// http://localhost:9000/browse/character
router.get('/characters', (req, res) => {
    //res.send('Hello, from controller...');
    res.render('browse/browse_characters', { favourites: [] });
});

// http://localhost:9000/browse/quote
router.get('/quotes', (req, res) => {
    //res.send('Hello, from controller...');
    res.render('browse/browse_quotes', { favourites: [] });
});

// http://localhost:9000/browse/reviews
router.get('/reviews', (req, res) => {
    //res.send('Hello, from controller...');
    res.render('browse/browse_reviews', { favourites: [] });
});

// http://localhost:9000/browse/anime/popular
router.get('/anime/popular', (req, res) => {
    //res.send('Hello, from controller...');
    res.render('browse/anime_popular', { favourites: [] });
});

// http://localhost:9000/browse/anime/recently_added
router.get('/anime/recently_added', (req, res) => {
    //res.send('Hello, from controller...');
    res.render('browse/anime_recently', { favourites: [] });
});

// http://localhost:9000/browse/anime/top-100
router.get('/anime/top-100', (req, res) => {
    //res.send('Hello, from controller...');
    res.render('browse/anime_top100', { favourites: [] });
});

// http://localhost:9000/browse/manga/popular

router.get('/manga/popular', (req, res) => {
    //res.send('Hello, from controller...');
    res.render('browse/manga_popular', { favourites: [] });
});

// http://localhost:9000/browse/manga/recently_added
router.get('/manga/recently_added', (req, res) => {
    //res.send('Hello, from controller...');
    res.render('browse/manga_recently', { favourites: [] });
});

// http://localhost:9000/browse/manga/top-100
router.get('/manga/top-100', (req, res) => {
    //res.send('Hello, from controller...');
    res.render('browse/manga_top100', { favourites: [] });
});
module.exports = router;