// controllers/hello.route.js
const express = require('express');
const router = express.Router();
const animeRepo = require('../utils/anime.repository');

router.get('/:mangaId/:mangaName', MangaViewAction);
router.get('/:mangaId', MangaViewAction);

router.get('/:animeId/:animeName/characters', MangaViewActionCharacters);
router.get('/:animeId/characters', MangaViewActionCharacters);


async function MangaViewAction(request, response) {
    var mangaId = request.params.mangaId;
    var mangaName = request.params.animeName;
    try {
        // Fetch the manga data
        var manga = await animeRepo.getOneManga(mangaId);
        var charactersDetails = await animeRepo.getCharactersByAnimeID(animeId);

        response.render("single_view/single_manga", { "charactersDetails": charactersDetails, "manga": manga, user: request.user,  activePage: 'browse'});
    } catch (error) {
        console.error('Error in MangaViewAction:', error);
        response.status(500).send('Internal Server Error');
    }
}


async function MangaViewActionCharacters(request, response) {
    var mangaId = request.params.mangaId;

    try {
        var manga = await animeRepo.getOneManga(mangaId);
        var charactersDetails = await animeRepo.getCharactersByAnimeID(mangaId);

        response.render("single_view/single_manga_characters", { "charactersDetails": charactersDetails, "manga": manga, user: request.user,  activePage: 'browse'  });
    } catch (error) {
        console.error('Error in MangaViewActionCharacters:', error);
        response.status(500).send('Internal Server Error');
    }
}
module.exports = router;