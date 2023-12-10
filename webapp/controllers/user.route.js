// controllers/hello.route.js
const express = require('express');
const router = express.Router();
const { checkUserAuthentication, checkAdminAuthentication } = require('../utils/users.auth');
const userRepo = require('../utils/users.repository');

router.use('/', checkUserAuthentication);
router.use('/', checkAdminAuthentication);

// http://localhost:9000/user
router.get('/', (req, res) => {
    res.render('user/user', { user: req.user, title: 'Profile - YourAnimeHub',activePage:'profile' });
});

// http://localhost:9000/user/watchlist
router.get('/watchlist', (req, res) => {
    res.render('user/user_watchlist', { user: req.user, title: 'Profile - YourAnimeHub', activePage: 'your_list' });
});

router.get('/settings', UserEditAction);
router.post('/settings/update/profile', UserUpdateProfileAction);
router.post('/settings/update/personal_details', UserUpdatePersonalAction);


async function UserEditAction(request, response) {
    var userId = request.user.UserID;

    try {
        // Fetch the user data
        var fetched_user = await userRepo.getOneUserByID(userId);

        response.render("user/user_settings", { "fetched_user": fetched_user,  user: request.user,activePage: 'profile' });
    } catch (error) {
        console.error('Error in UserEditAction:', error);
        response.status(500).send('Internal Server Error');
    }
}


async function UserUpdateProfileAction(request, response) {
    var userId = request.user.UserID;
    var userName = request.user.Username;
    var userData = {
        ProfilePictureURL: request.body.profile_pic,
        TitleDisplayLanguage: request.body.titleDisplay || null,
        Bio: request.body.bio || null,
    };

    try {
        var numRows = await userRepo.editOneUser(userId, userData);

        response.redirect("/user/settings");
    } catch (error) {
        console.error('Error:', error);
        response.status(500).send(" UserUpdateProfileAction Internal Server Error");
    }
}


async function UserUpdatePersonalAction(request, response) {
    var userId = request.user.UserID;
    var userData = {
        Username: request.body.username,
        Email: request.body.email,
        Birthday: request.body.birthday,
    };

    try {
        var numRows = await userRepo.editOneUser(userId, userData);

        console.log("modif userna");
        response.redirect("/user/settings");
    } catch (error) {
        console.error('Error:', error);
        response.status(500).send(" UserUpdatePersonalAction Internal Server Error");
    }
}


//http://localhost:9000/user/reviews
router.get('/reviews', (req, res) => {
    res.render('user/user_reviews', { user: req.user,  activePage: 'profile' });
});

//http://localhost:9000/user/favourites
router.get('/favourites', (req, res) => {
    res.render('user/user_favourites', { user: req.user,  activePage: 'profile' });
});

module.exports = router;