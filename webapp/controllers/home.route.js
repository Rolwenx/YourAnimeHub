
const express = require('express');
const router = express.Router();
const animeRepo = require('../utils/anime.repository');
const quoteRepo = require('../utils/quote.repository');
const characterRepo = require('../utils/characters.repository');
const userRepo = require('../utils/users.repository');




router.get('/', GuestHomeAction);

// New route for handling search queries
router.post('/search', handleSearch);

async function handleSearch(req, res) {
    try {
        const searchQuery = req.body.searchQuery;

        const searchResults = await animeRepo.searchAnimeManga(searchQuery);
        console.log("searchResults",searchResults);
        console.log(searchResults == null);

        res.render('search', {
            "searchResults":searchResults,
            user: req.user,
            title: `Search Results for "${searchQuery}" - YourAnimeHub`,
            activePage: 'search-results',
        });
    } catch (error) {
        console.error('Error in handleSearch:', error);
        res.status(500).send('Internal Server Error');
    }
}



// Admin Home route
async function GuestHomeAction(request, res) {
    try {
        // Check if user is logged in
        var userId = request.user ? request.user.UserID : null;
        const animeMangaList = await animeRepo.getAllAnimeManga();
        const TopAnime = await animeRepo.getMostFavourited(10);
        const MostLiked = await animeRepo.getMostLiked(5);
        const characterList = await characterRepo.getAllCharacters();
        const animeList = await animeRepo.getAllAnime();
        const mangaList = await animeRepo.getAllMangas();
        const quote_of_the_day = await quoteRepo.transformQuoteOfDay();

        var WatchingAnimeList = await userRepo.getAllAnimeForWatchlist(userId,'aset-watching');
        var ReadingMangaList = await userRepo.getAllMangaForWatchlist(userId,'mset-reading');
        // Log user role in the console
        console.log("User Role:", request.user ? request.user.UserRole : "Guest");

        res.render('home', { 
            MostLiked,
            TopAnime,
            animeMangaList,
            user: request.user,
            animeList,
            mangaList,
            quote_of_the_day,
            characterList,
            WatchingAnimeList,
            ReadingMangaList,
            title: 'Home - YourAnimeHub',
            activePage: 'home',
            });
    } catch (error) {
        console.error('Error in GuestHomeAction:', error);
        res.status(500).send('Internal Server Error HEREE');
    }
}


module.exports = router;