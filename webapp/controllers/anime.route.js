// controllers/hello.route.js
const express = require('express');
const router = express.Router();
const animeRepo = require('../utils/anime.repository');

router.get('/:animeId/:animeName', adminAnimeViewAction);


async function adminAnimeViewAction(request, response) {
    var animeId = request.params.animeId;
    var charName = request.params.animeName;

    try {
        // Fetch the anime data
        var anime = await animeRepo.getOneAnime(animeId);
        console.log(anime);

        response.render("single_view/single_anime", { "anime": anime });
    } catch (error) {
        console.error('Error in adminAnimeViewAction:', error);
        response.status(500).send('Internal Server Error');
    }
}

module.exports = router;