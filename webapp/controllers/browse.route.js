// controllers/hello.route.js
const express = require('express');
const router = express.Router();
const animeRepo = require('../utils/anime.repository');
const reviewRepo = require('../utils/review.repository');
const quoteRepo = require('../utils/quote.repository'); 
const characterRepo = require('../utils/characters.repository');


/* -------_ SEARCH ANIME ROUTES --------*/
router.get('/search_anime', handleSearchAnime);
router.get('/anime/recently_added/search_anime', handleSearchAnimeRecently);
router.get('/anime/popular/search_anime', handleSearchAnimePopular);
router.get('/anime/top-100/search_anime', handleSearchAnimeLiked);

async function handleSearchAnime(req, res) {
    try {
        const searchQuery = req.query.searchQueryAnime;

        const MostLikedsearchResults = await animeRepo.searchAnimeByMostLiked(searchQuery, 'Anime');
        const MostFavouritedearchResults = await animeRepo.searchAnimeByMostFavourited(searchQuery, 'Anime')
        const SearchResults = await animeRepo.searchAnime(searchQuery, 'Anime');

        res.render('search/search_browse_anime', {
            MostLikedsearchResults,
            MostFavouritedearchResults,
            SearchResults,
            user: req.user,
            title: `Search Results for "${searchQuery}" - YourAnimeHub`,
            activePage: 'search-results',
        });
    } catch (error) {
        console.error('Error in handleSearchAnime:', error);
        res.status(500).send('Internal Server Error');
    }
}

async function handleSearchAnimeRecently(req, res) {
    try {
        const searchQuery = req.query.searchQueryAnime;
        const SearchResults = await animeRepo.searchAnime(searchQuery, 'Anime');

        res.render('search/search_anime_recently', {
            SearchResults,
            user: req.user,
            title: `Search Results for "${searchQuery}" - YourAnimeHub`,
            activePage: 'search-results',
        });
    } catch (error) {
        console.error('Error in handleSearchAnimeRecently:', error);
        res.status(500).send('Internal Server Error');
    }
}

async function handleSearchAnimePopular(req, res) {
    try {
        const searchQuery = req.query.searchQueryAnime;

        const MostFavouritedearchResults = await animeRepo.searchAnimeByMostFavourited(searchQuery, 'Anime')

        res.render('search/search_anime_popular', {
            MostFavouritedearchResults,
            user: req.user,
            title: `Search Results for "${searchQuery}" - YourAnimeHub`,
            activePage: 'search-results',
        });
    } catch (error) {
        console.error('Error in handleSearch:', error);
        res.status(500).send('Internal Server Error');
    }
}

async function handleSearchAnimeLiked(req, res) {
    try {
        const searchQuery = req.query.searchQueryAnime;

        const MostLikedsearchResults = await animeRepo.searchAnimeByMostLiked(searchQuery, 'Anime');

        res.render('search/search_anime_top', {
            MostLikedsearchResults,
            user: req.user,
            title: `Search Results for "${searchQuery}" - YourAnimeHub`,
            activePage: 'search-results',
        });
    } catch (error) {
        console.error('Error in handleSearch:', error);
        res.status(500).send('Internal Server Error');
    }
}


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
        const TopAnime = await animeRepo.getMostFavouritedType('Anime',10);
        const MostLiked = await animeRepo.getMostLikedType('Anime',8);

        


        res.render('browse/browse_anime', {
            TopAnime,
            MostLiked,
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
        const TopManga = await animeRepo.getMostFavouritedType('Manga',10);
        const MostLiked = await animeRepo.getMostLikedType('Manga',8);
        
        res.render('browse/browse_manga', {
            MostLiked,
            TopManga,
            mangaList,user: request.user,
            activePage: 'browse',
        });
    } catch (error) {
        console.error('Error in browseMangaAction:', error);
        res.status(500).send('Internal Server Error');
    }
    
}


/* ------- CHARACTER ROUTES --------*/
router.get('/search_character', handleSearchCharacters);

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

async function handleSearchCharacters(req, res) {
    try {
        const searchQuery = req.query.searchQueryChar;

        const SearchedChar = await characterRepo.searchCharacters(searchQuery);

        res.render('search/search_character', {
            SearchedChar,
            user: req.user,
            title: `Search Results for "${searchQuery}" - YourAnimeHub`,
            activePage: 'search-results',
        });
    } catch (error) {
        console.error('Error in handleSearchMangaLiked:', error);
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
        const MostLiked = await animeRepo.getMostLikedType('Anime',1000);


        res.render('browse/anime_popular', {
            MostLiked,
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
        const TopAnime = await animeRepo.getMostFavouritedType('Anime',1000);


        res.render('browse/anime_top100', {
            TopAnime,
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
        const MostLiked = await animeRepo.getMostLikedType('Manga',1000);


        res.render('browse/manga_popular', {
            MostLiked,
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
        const TopManga = await animeRepo.getMostFavouritedType('Anime',1000);


        res.render('browse/manga_top100', {
            TopManga,
            mangaList,user: request.user,
            activePage: 'browse',
        });
    } catch (error) {
        console.error('Error in browseMangaTopAction:', error);
        res.status(500).send('Internal Server Error');
    }
    
}




/* -------_ SEARCH ANIME ROUTES --------*/
router.get('/search_manga', handleSearchManga);
router.get('/manga/recently_added/search_manga', handleSearchMangaRecently);
router.get('/manga/popular/search_manga', handleSearchMangaPopular);
router.get('/manga/top-100/search_manga', handleSearchMangaLiked);

async function handleSearchManga(req, res) {
    try {
        const searchQuery = req.query.searchQueryAnime;

        const MostLikedsearchResults = await animeRepo.searchAnimeByMostLiked(searchQuery, 'Manga');
        const MostFavouritedearchResults = await animeRepo.searchAnimeByMostFavourited(searchQuery, 'Manga')
        const SearchResults = await animeRepo.searchAnime(searchQuery, 'Manga');

        res.render('search/search_browse_manga', {
            MostLikedsearchResults,
            MostFavouritedearchResults,
            SearchResults,
            user: req.user,
            title: `Search Results for "${searchQuery}" - YourAnimeHub`,
            activePage: 'search-results',
        });
    } catch (error) {
        console.error('Error in handleSearchManga:', error);
        res.status(500).send('Internal Server Error');
    }
}

async function handleSearchMangaRecently(req, res) {
    try {
        const searchQuery = req.query.searchQueryAnime;
        const SearchResults = await animeRepo.searchAnime(searchQuery, 'Manga');

        res.render('search/search_manga_recently', {
            SearchResults,
            user: req.user,
            title: `Search Results for "${searchQuery}" - YourAnimeHub`,
            activePage: 'search-results',
        });
    } catch (error) {
        console.error('Error in handleSearchMangaecently:', error);
        res.status(500).send('Internal Server Error');
    }
}

async function handleSearchMangaPopular(req, res) {
    try {
        const searchQuery = req.query.searchQueryAnime;

        const MostFavouritedearchResults = await animeRepo.searchAnimeByMostFavourited(searchQuery, 'Manga')

        res.render('search/search_manga_popular', {
            MostFavouritedearchResults,
            user: req.user,
            title: `Search Results for "${searchQuery}" - YourAnimeHub`,
            activePage: 'search-results',
        });
    } catch (error) {
        console.error('Error in handleSearchMangaPopular:', error);
        res.status(500).send('Internal Server Error');
    }
}

async function handleSearchMangaLiked(req, res) {
    try {
        const searchQuery = req.query.searchQueryAnime;

        const MostLikedsearchResults = await animeRepo.searchAnimeByMostLiked(searchQuery, 'Manga');

        res.render('search/search_manga_top', {
            MostLikedsearchResults,
            user: req.user,
            title: `Search Results for "${searchQuery}" - YourAnimeHub`,
            activePage: 'search-results',
        });
    } catch (error) {
        console.error('Error in handleSearchMangaLiked:', error);
        res.status(500).send('Internal Server Error');
    }
}
module.exports = router;