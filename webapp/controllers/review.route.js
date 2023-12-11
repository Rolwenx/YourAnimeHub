// controllers/hello.route.js
const express = require('express');
const router = express.Router();
const animeRepo = require('../utils/anime.repository');
const userRepo = require('../utils/users.repository');

// Since the review ID isn't auto increment, we use this library to give a unique ID to ReviewId
const { v4: uuidv4 } = require('uuid');


router.get('/:animeId/:reviewId', ReviewViewAction);

router.get('/editor/anime/:animeId', ReviewEditorViewAction);
router.post('/editor/anime/:animeId/post', ReviewEditorPostAction);


async function ReviewViewAction(request, response) {
    const animeId = request.params.animeId;
    userId = request.user.UserID;
    const reviewId = animeRepo.getReviewID(animeId,userId);

    try {
        var ReviewInfo = await animeRepo.getReviewInfo(animeId,userId);
        console.log(ReviewInfo);
        console.log(ReviewInfo[0].Username);

        response.render("single_view/single_review", {"ReviewInfo": ReviewInfo, user: request.user,  activePage: 'browse'  });
    } catch (error) {
        console.error('Error in ReviewViewAction:', error);
        response.status(500).send('Internal Server Error');
    }
}




async function ReviewEditorViewAction(request, response) {
    const animeId = request.params.animeId;
    var anime = await animeRepo.getOneAnime(animeId);


    try {
        response.render("review_editor_anime", {"anime":anime, user: request.user,  activePage: 'profile'  });
    } catch (error) {
        console.error('Error in ReviewViewAction:', error);
        response.status(500).send('Internal Server Error');
    }
}

async function ReviewEditorPostAction(request, response) {
    const animeId = request.params.animeId;
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




router.get('/editor/manga/:mangaId', ReviewEditorViewActionManga);
router.post('/editor/manga/:mangaId/post', ReviewEditorPostActionManga);

async function ReviewEditorViewActionManga(request, response) {
    const mangaId = request.params.mangaId;
    var manga = await animeRepo.getOneManga(mangaId);

    try {
        response.render("review_editor_manga", {"manga":manga, user: request.user,  activePage: 'profile'  });
    } catch (error) {
        console.error('Error in ReviewViewAction:', error);
        response.status(500).send('Internal Server Error');
    }
}

async function ReviewEditorPostActionManga(request, response) {
    const mangaId = request.params.mangaId;
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
    var result = await userRepo.addOneReview(reviewData, userId,mangaId);
        response.send(`
          <script>
            alert('Review has been sent.');
            window.location.href = '/user/reviews';
          </script>
        `);
        return response.end(); 
}





module.exports = router;