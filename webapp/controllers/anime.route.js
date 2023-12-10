// controllers/hello.route.js
const express = require('express');
const router = express.Router();
const animeRepo = require('../utils/anime.repository');


router.get('/:animeId/:animeName', AnimeViewAction);
router.get('/:animeId', AnimeViewAction);

router.get('/:animeId/:animeName/characters', AnimeViewActionCharacters);
router.get('/:animeId/characters', AnimeViewActionCharacters);



async function AnimeViewAction(request, response) {
    var animeId = request.params.animeId;
    var charName = request.params.animeName;

    try {
        // Fetch the anime data
        // Awaits makes sure the promise is resolved before continuing with the execution
        var anime = await animeRepo.getOneAnime(animeId);
        var charactersDetails = await animeRepo.getCharactersByAnimeID(animeId);

        response.render("single_view/single_anime", { "charactersDetails": charactersDetails, "anime": anime, user: request.user,  activePage: 'browse'  });
    } catch (error) {
        console.error('Error in AnimeViewAction:', error);
        response.status(500).send('Internal Server Error');
    }
}


async function AnimeViewActionCharacters(request, response) {
    var animeId = request.params.animeId;

    try {
        // Fetch the anime data
        // Awaits makes sure the promise is resolved before continuing with the execution
        var anime = await animeRepo.getOneAnime(animeId);
        var charactersDetails = await animeRepo.getCharactersByAnimeID(animeId);

        response.render("single_view/single_anime_characters", { "charactersDetails": charactersDetails, "anime": anime, user: request.user,  activePage: 'browse'  });
    } catch (error) {
        console.error('Error in AnimeViewActionCharacters:', error);
        response.status(500).send('Internal Server Error');
    }
}

module.exports = router;