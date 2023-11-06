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
    res.render('browse_anime', { favourites: [] });
});

// http://localhost:9000/browse/manga
router.get('/manga', (req, res) => {
    //res.send('Hello, from controller...');
    res.render('browse_manga', { favourites: [] });
});

// http://localhost:9000/browse/character
router.get('/characters', (req, res) => {
    //res.send('Hello, from controller...');
    res.render('browse_characters', { favourites: [] });
});

// http://localhost:9000/browse/quote
router.get('/quotes', (req, res) => {
    //res.send('Hello, from controller...');
    res.render('browse_quotes', { favourites: [] });
});

// http://localhost:9000/browse/reviews
router.get('/reviews', (req, res) => {
    //res.send('Hello, from controller...');
    res.render('browse_reviews', { favourites: [] });
});
module.exports = router;