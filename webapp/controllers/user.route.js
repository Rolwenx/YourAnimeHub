// controllers/hello.route.js
const express = require('express');
const router = express.Router();

router.get('/my/:name', mynameAction);
router.get('/myy', mynameAction);
async function mynameAction(request, response) {
    response.send("MYNAME ACTION "+request.params.name);
}

// http://localhost:9000/user
router.get('/', (req, res) => {
    //res.send('Hello, from controller...');
    res.render('user/user', { favourites: [] });
});

// http://localhost:9000/user/watchlist
router.get('/watchlist', (req, res) => {
    //res.send('Hello, from controller...');
    res.render('user/user_watchlist', { favourites: [] });
});

// http://localhost:9000/user/settings
router.get('/settings', (req, res) => {
    //res.send('Hello, from controller...');
    res.render('user/user_settings', { favourites: [] });
});

//http://localhost:9000/user/reviews
router.get('/reviews', (req, res) => {
    //res.send('Hello, from controller...');
    res.render('user/user_reviews', { favourites: [] });
});

module.exports = router;