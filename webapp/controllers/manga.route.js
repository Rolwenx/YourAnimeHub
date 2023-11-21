// controllers/hello.route.js
const express = require('express');
const router = express.Router();
const animeRepo = require('../utils/anime.repository');

router.get('/:mangaId/:mangaName', adminMangaViewAction);


async function adminMangaViewAction(request, response) {
    var mangaId = request.params.mangaId;
    var mangaName = request.params.animeName;

    try {
        // Fetch the manga data
        var manga = await animeRepo.getOneManga(mangaId);

        response.render("single_view/single_manga", { "manga": manga });
    } catch (error) {
        console.error('Error in adminMangaViewAction:', error);
        response.status(500).send('Internal Server Error');
    }
}
module.exports = router;