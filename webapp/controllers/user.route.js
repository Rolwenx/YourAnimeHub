// controllers/hello.route.js
const express = require('express');
const router = express.Router();
const { checkUserAuthentication, checkAdminAuthentication } = require('../utils/users.auth');

router.use('/', checkUserAuthentication);
router.use('/', checkAdminAuthentication);

// http://localhost:9000/user
router.get('/', (req, res) => {
    //res.send('Hello, from controller...');
    res.render('user/user', { user: req.user, title: 'Profile - YourAnimeHub', activePage: 'profile',
    activePage: 'home', });
});

// http://localhost:9000/user/watchlist
router.get('/watchlist', (req, res) => {
    //res.send('Hello, from controller...');
    res.render('user/user_watchlist', { user: req.user, title: 'Profile - YourAnimeHub', activePage: 'your_list' });
});

// http://localhost:9000/user/settings
router.get('/settings', (req, res) => {
    //res.send('Hello, from controller...');
    res.render('user/user_settings', { user: req.user,  activePage: 'profile' });
});

//http://localhost:9000/user/reviews
router.get('/reviews', (req, res) => {
    //res.send('Hello, from controller...');
    res.render('user/user_reviews', { user: req.user,  activePage: 'profile' });
});

//http://localhost:9000/user/favourites
router.get('/favourites', (req, res) => {
    //res.send('Hello, from controller...');
    res.render('user/user_favourites', { user: req.user,  activePage: 'profile' });
});

module.exports = router;