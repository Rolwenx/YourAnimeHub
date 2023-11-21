// controllers/hello.route.js
const express = require('express');
const router = express.Router();
const animeRepo = require('../utils/anime.repository');
const quoteRepo = require('../utils/quote.repository'); 
const characterRepo = require('../utils/characters.repository');

// Main routes
router.get('/anime', browseAnimeAction);
router.get('/manga', browseMangaAction);
router.get('/characters', browseCharacterAction);
router.get('/quotes', browseQuoteAction);
//router.get('/browse/reviews', browseReviewsAction);

router.get('/anime/recently_added', browseAnimeRecentlyAddedAction);

router.get('/manga/recently_added', browseMangaRecentlyAddedAction);


async function browseAnimeAction(request, res) {
    
    try {
        const animeList = await animeRepo.getAllAnime();


        res.render('browse/browse_anime', {
            animeList,
        });
    } catch (error) {
        console.error('Error in browseAnimeAction:', error);
        res.status(500).send('Internal Server Error');
    }
    
}

async function browseMangaAction(request, res) {
    
    try {
        const mangaList = await animeRepo.getAllMangas();
        res.render('browse/browse_manga', {
            mangaList,
        });
    } catch (error) {
        console.error('Error in browseMangaAction:', error);
        res.status(500).send('Internal Server Error');
    }
    
}

async function browseCharacterAction(request, res) {
    
    try {
        const characterList = await characterRepo.getAllCharacters();
        res.render('browse/browse_characters', {
            characterList,
        });

    } catch (error) {
        console.error('Error in browseCharacterAction:', error);
        res.status(500).send('Internal Server Error');
    }
    
}

async function browseQuoteAction(request, res) {
    
    try {
        const quoteList = await quoteRepo.getAllQuotes();


        res.render('browse/browse_quotes', {
            quoteList,
        });
    } catch (error) {
        console.error('Error in browseQuoteAction:', error);
        res.status(500).send('Internal Server Error');
    }
    
}

async function browseAnimeRecentlyAddedAction(request, res) {
    
    try {
        const animeList = await animeRepo.getAllAnime();


        res.render('browse/anime_recently', {
            animeList,
        });
    } catch (error) {
        console.error('Error in browseAnimeRecentlyAddedAction:', error);
        res.status(500).send('Internal Server Error');
    }
    
}

async function browseMangaRecentlyAddedAction(request, res) {
    
    try {
        const mangaList = await animeRepo.getAllMangas();


        res.render('browse/manga_recently', {
            mangaList,
        });
    } catch (error) {
        console.error('Error in browseMangaRecentlyAddedAction:', error);
        res.status(500).send('Internal Server Error');
    }
    
}



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