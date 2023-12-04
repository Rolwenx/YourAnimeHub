
const express = require('express');
const router = express.Router();
const animeRepo = require('../utils/anime.repository');
const quoteRepo = require('../utils/quote.repository');


router.get('/', GuestHomeAction);


// Admin Home route
async function GuestHomeAction(request, res) {
    try {
        const animeMangaList = await animeRepo.getAllAnimeManga();
        const animeList = await animeRepo.getAllAnime();
        const mangaList = await animeRepo.getAllMangas();
        const quote_of_the_day = await quoteRepo.transformQuoteOfDay();
        // Log user role in the console
        console.log("User Role:", request.user ? request.user.UserRole : "Guest");

        res.render('home', { 
            animeMangaList,
            user: request.user,
            animeList,
            mangaList,
            quote_of_the_day,
            favourites: [] });
    } catch (error) {
        console.error('Error in GuestHomeAction:', error);
        res.status(500).send('Internal Server Error');
    }
}


module.exports = router;