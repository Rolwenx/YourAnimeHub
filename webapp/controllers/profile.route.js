// controllers/hello.route.js
const express = require('express');
const router = express.Router();

router.get('/my/:name', mynameAction);
router.get('/myy', mynameAction);
async function mynameAction(request, response) {
    response.send("MYNAME ACTION "+request.params.name);
}

// http://localhost:9000/profile
router.get('/', (req, res) => {
    //res.send('Hello, from controller...');
    res.render('profile', { favourites: [] });
});

// http://localhost:9000/profile/watchlist
router.get('/watchlist', (req, res) => {
    //res.send('Hello, from controller...');
    res.render('profile_watchlist', { favourites: [] });
});

// http://localhost:9000/profile/settings
router.get('/settings', (req, res) => {
    //res.send('Hello, from controller...');
    res.render('profile_settings', { favourites: [] });
});

module.exports = router;