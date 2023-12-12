const express = require('express');
const router = express.Router();
const animeRepo = require('../utils/anime.repository');
const reviewRepo = require('../utils/review.repository');
const { checkUserAuthentication } = require('../utils/users.auth');

// Middleware to check user authentication, applied only to editor routes
router.use(['/editor/anime/:animeId', '/editor/manga/:mangaId'], checkUserAuthentication);


// Since the review ID isn't auto increment, we use this library to give a unique ID to ReviewId
const { v4: uuidv4 } = require('uuid');

router.get('/:animeId/:reviewId', ReviewViewAction);

router.get('/editor/anime/:animeId', ReviewAddEditorViewAction);
router.post('/editor/anime/:animeId/post', ReviewAddEditorPostAction);
router.get('/editor/anime/:animeId/edit', ReviewEditEditorViewAction);
router.post('/editor/anime/:animeId/edit/post', ReviewEditEditorPostAction);

async function ReviewViewAction(request, response) {
    const reviewId = request.params.reviewId;
    var result = await reviewRepo.getAnimeIDFromReviewID(reviewId);
    const animeId = result.AnimeID;
    const userId = result.UserID;

    try {
        var ReviewInfo = userId ? await reviewRepo.getReviewInfo(animeId, userId) : null;
        console.log(ReviewInfo);

        response.render("single_view/single_review", { "ReviewInfo": ReviewInfo, user: request.user, activePage: 'browse' });
    } catch (error) {
        console.error('Error in ReviewViewAction:', error);
        response.status(500).send('Internal Server Error');
    }
}

async function ReviewAddEditorViewAction(request, response) {
    const animeId = request.params.animeId;
    var anime = await animeRepo.getOneAnime(animeId);

    try {
        response.render("review_editors/review_editor_anime", { "anime": anime, user: request.user, activePage: 'profile' });
    } catch (error) {
        console.error('Error in ReviewViewAction:', error);
        response.status(500).send('Internal Server Error');
    }
}

async function ReviewAddEditorPostAction(request, response) {
    const animeId = request.params.animeId;
    const userId = request.user ? request.user.UserID : null;

    if (!userId) {
        // Handle the case where the user is not authenticated
        response.status(403).send('Unauthorized');
        return;
    }

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

    var result = await reviewRepo.addOneReview(reviewData, userId, animeId);
    response.send(`
          <script>
            alert('Review has been sent.');
            window.location.href = '/user/reviews';
          </script>
        `);
    return response.end();
}


async function ReviewEditEditorViewAction(request, response) {
    const animeId = request.params.animeId;
    var anime = await animeRepo.getOneAnime(animeId);
    const userId = request.user ? request.user.UserID : null;
    const review_info = await reviewRepo.getReviewInfo(animeId, userId) 
    console.log("review_info",review_info);

    try {
        response.render("review_editors/review_edit_anime_edit", {"review_info":review_info,
         "anime": anime, user: request.user, activePage: 'profile' });
    } catch (error) {
        console.error('Error in ReviewEditEditorViewAction:', error);
        response.status(500).send('Internal Server Error');
    }
}

async function ReviewEditEditorPostAction(request, response) {
    const animeId = request.params.animeId;
    const userId = request.user ? request.user.UserID : null;

    if (!userId) {
        // Handle the case where the user is not authenticated
        response.status(403).send('Unauthorized');
        return;
    }

    var reviewData = {
        ReviewText: request.body.review,
        ReviewSummary: request.body.reviewSummary || null,
        ReviewGrade: request.body.score || null,
    };

    console.log(reviewData);
    for (const key in reviewData) {
        const value = reviewData[key];
        console.log(`Key: ${key}, Value: ${value}`);
      }

    var result = await reviewRepo.editOneReview(reviewData, userId, animeId);
    response.send(`
          <script>
            alert('Review has been modified.');
            window.location.href = '/user/reviews';
          </script>
        `);
    return response.end();
}



router.get('/editor/manga/:mangaId', ReviewAddEditorViewActionManga);
router.post('/editor/manga/:mangaId/post', ReviewAddEditorPostActionManga);

async function ReviewAddEditorViewActionManga(request, response) {
    const mangaId = request.params.mangaId;
    var manga = await animeRepo.getOneManga(mangaId);

    try {
        response.render("review_editors/review_edit_manga", { "manga": manga, user: request.user, activePage: 'profile' });
    } catch (error) {
        console.error('Error in ReviewViewAction:', error);
        response.status(500).send('Internal Server Error');
    }
}

async function ReviewAddEditorPostActionManga(request, response) {
    const mangaId = request.params.mangaId;
    const userId = request.user ? request.user.UserID : null;

    if (!userId) {
        // Handle the case where the user is not authenticated
        response.status(403).send('Unauthorized');
        return;
    }

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

    var result = await reviewRepo.addOneReview(reviewData, userId, mangaId);
    response.send(`
          <script>
            alert('Review has been sent.');
            window.location.href = '/user/reviews';
          </script>
        `);
    return response.end();
}

module.exports = router;
