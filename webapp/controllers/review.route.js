// controllers/hello.route.js
const express = require('express');
const router = express.Router();
const animeRepo = require('../utils/anime.repository');
const userRepo = require('../utils/users.repository');

// Since the review ID isn't auto increment, we use this library to give a unique ID to ReviewId
const { v4: uuidv4 } = require('uuid');


router.get('/reviewid', ReviewViewAction);

router.get('/editor/:animeId', ReviewEditorViewAction);
router.post('/editor/:animeId/post', ReviewEditorPostAction);


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


async function ReviewEditorViewAction(request, response) {
    var animeId = request.params.animeId;
    var anime = await animeRepo.getOneAnime(animeId);

    try {
        response.render("review_editor", {"anime":anime, user: request.user,  activePage: 'profile'  });
    } catch (error) {
        console.error('Error in ReviewViewAction:', error);
        response.status(500).send('Internal Server Error');
    }
}

async function ReviewEditorPostAction(request, response) {
    var animeId = request.params.animeId;
    userId = request.user.UserID;
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];


    var reviewData = {
        ReviewID: uuidv4(),
        ReviewText: request.body.review,
        ReviewSummary: request.body.reviewSummary || null,
        ReviewGrade: request.body.score || null,
        ReviewDate: formattedDate,
        LikesOnReview: 0,
        DislikesOnReview: 0,
        
    };
    var result = await userRepo.addOneReview(reviewData, userId,animeId);
        response.send(`
          <script>
            alert('Review has been sent.');
            window.location.href = '/user/reviews';
          </script>
        `);
        return response.end(); 
}




module.exports = router;