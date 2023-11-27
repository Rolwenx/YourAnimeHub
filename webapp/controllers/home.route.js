
// controllers/hello.route.js
const express = require('express');
const router = express.Router();
const animeRepo = require('../utils/anime.repository');


router.get('/', GuestHomeAction);


// Admin Home route
async function GuestHomeAction(request, res) {
    try {
        const animeMangaList = await animeRepo.getAllAnimeManga();

        res.render('home', { 
            animeMangaList,
            favourites: [] });
    } catch (error) {
        console.error('Error in GuestHomeAction:', error);
        res.status(500).send('Internal Server Error');
    }
}


module.exports = router;