// controllers/hello.route.js
const express = require('express');
const router = express.Router();
const animeRepo = require('../utils/anime.repository');
const reviewRepo = require('../utils/review.repository');
const quoteRepo = require('../utils/quote.repository'); 
const characterRepo = require('../utils/characters.repository');

// Main routes
router.get('/anime', browseAnimeAction);
router.get('/manga', browseMangaAction);
router.get('/characters', browseCharacterAction);
router.get('/quotes', browseQuoteAction);
router.get('/reviews', browseReviewsAction);

router.get('/anime/recently_added', browseAnimeRecentlyAddedAction);
router.get('/anime/popular', browseAnimePopularAction);
router.get('/anime/top-100', browseAnimeTopAction);

router.get('/manga/recently_added', browseMangaRecentlyAddedAction);
router.get('/manga/popular', browseMangaPopularAction);
router.get('/manga/top-100', browseMangaTopAction);

async function browseReviewsAction(request, res) {
    
    try {
        const ReviewList = await reviewRepo.getAllReviews();

        res.render('browse/browse_reviews', {
            ReviewList,
            user: request.user,
            title: 'Browse Anime - YourAnimeHub',
            activePage: 'browse',
        });
    } catch (error) {
        console.error('Error in browseReviewsAction:', error);
        res.status(500).send('Internal Server Error');
    }
    
}

async function browseAnimeAction(request, res) {
    
    try {
        const animeList = await animeRepo.getAllAnime();


        res.render('browse/browse_anime', {
            animeList,
            user: request.user,
            title: 'Browse Anime - YourAnimeHub',
            activePage: 'browse',
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
            mangaList,user: request.user,
            activePage: 'browse',
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
            characterList,user: request.user,
            activePage: 'browse',
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
            quoteList,user: request.user,
            activePage: 'browse',
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
            animeList,user: request.user,
            activePage: 'browse',
        });
    } catch (error) {
        console.error('Error in browseAnimeRecentlyAddedAction:', error);
        res.status(500).send('Internal Server Error');
    }
    
}

async function browseAnimePopularAction(request, res) {
    
    try {
        const animeList = await animeRepo.getAllAnime();


        res.render('browse/anime_popular', {
            animeList,user: request.user,
            activePage: 'browse',
        });
    } catch (error) {
        console.error('Error in browseAnimePopularAction:', error);
        res.status(500).send('Internal Server Error');
    }
    
}

async function browseAnimeTopAction(request, res) {
    
    try {
        const animeList = await animeRepo.getAllAnime();


        res.render('browse/anime_top100', {
            animeList,user: request.user,
            activePage: 'browse',
        });
    } catch (error) {
        console.error('Error in browseAnimeTopAction:', error);
        res.status(500).send('Internal Server Error');
    }
    
}

async function browseMangaRecentlyAddedAction(request, res) {
    
    try {
        const mangaList = await animeRepo.getAllMangas();


        res.render('browse/manga_recently', {
            mangaList,user: request.user,
            activePage: 'browse',
        });
    } catch (error) {
        console.error('Error in browseMangaRecentlyAddedAction:', error);
        res.status(500).send('Internal Server Error');
    }
    
}

async function browseMangaPopularAction(request, res) {
    
    try {
        const mangaList = await animeRepo.getAllMangas();


        res.render('browse/manga_popular', {
            mangaList,user: request.user,
            activePage: 'browse',
        });
    } catch (error) {
        console.error('Error in browseMangaPopularAction:', error);
        res.status(500).send('Internal Server Error');
    }
    
}

async function browseMangaTopAction(request, res) {
    
    try {
        const mangaList = await animeRepo.getAllMangas();


        res.render('browse/manga_top100', {
            mangaList,user: request.user,
            activePage: 'browse',
        });
    } catch (error) {
        console.error('Error in browseMangaTopAction:', error);
        res.status(500).send('Internal Server Error');
    }
    
}
module.exports = router;