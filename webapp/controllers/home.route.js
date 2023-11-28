
const express = require('express');
const router = express.Router();
const animeRepo = require('../utils/anime.repository');


router.get('/', GuestHomeAction);


// Admin Home route
async function GuestHomeAction(request, res) {
    try {
        const animeMangaList = await animeRepo.getAllAnimeManga();

        // Log user role in the console
        console.log("User Role:", request.user ? request.user.UserRole : "Guest");

        res.render('home', { 
            animeMangaList,
            user: request.user, // Pass the user object to the view
            favourites: [] });
    } catch (error) {
        console.error('Error in GuestHomeAction:', error);
        res.status(500).send('Internal Server Error');
    }
}


module.exports = router;