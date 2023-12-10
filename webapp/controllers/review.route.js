// controllers/hello.route.js
const express = require('express');
const router = express.Router();
const animeRepo = require('../utils/anime.repository');


router.get('/reviewid', ReviewViewAction);


async function ReviewViewAction(request, response) {
    var animeId = request.params.animeId;

    try {
        var animeMangaList = await animeRepo.getAllAnimeManga(animeId);

        response.render("single_view/single_review", {"animeMangaList": animeMangaList, user: request.user,  activePage: 'browse'  });
    } catch (error) {
        console.error('Error in ReviewViewAction:', error);
        response.status(500).send('Internal Server Error');
    }
}



module.exports = router;