const express = require('express');
const router = express.Router();
const animeRepo = require('../utils/anime.repository');
const reviewRepo = require('../utils/review.repository');


router.post('/:mangaId/set', async (req, res) => {
    try {
        const { action } = req.body;
        var mangaId = req.params.mangaId;
        const userId = req.user ? req.user.UserID : null;
        const type = "manga";
        const whichId = mangaId;
        
        if (!userId) {
            const text = 'Unauthorized. Please log in to perform this action.';
            
            return res.render('partials/RedirectionAlert', { whichId, text, type});
        }

        if (action === 'mset-complete' || action === 'mset-reading' || action === 'mset-planning') {
            await animeRepo.updateAnimeStatus(userId, mangaId, action);
            const text = 'Manga status updated successfully.';
            return res.render('partials/RedirectionAlert', { whichId, text, type});
        } else {
            const text = 'Unauthorized Action.';
            return res.render('partials/RedirectionAlert', { whichId, text, type});
        }

    } catch (error) {
        console.error('Error:', error);
        res.send(`
            <script>
                alert('Internal Server Error');
                window.location.href = '/browse/manga';
            </script>
        `);
        return res.end();
    }
});


router.post('/:mangaId/like', async (req, res) => {
    try {

        var mangaId = req.params.mangaId;
        const userId = req.user ? req.user.UserID : null;
        const type = "manga";
        const whichId = mangaId;
        
        if (!userId) {
            const text = 'Unauthorized. Please log in to perform this action.';
            
            return res.render('partials/RedirectionAlert', { whichId, text, type});
        }
        const has_user_liked = await animeRepo.CheckIfUserHasLikedAnime(userId,mangaId);

        if(has_user_liked == true){
            const text = 'Manga has removed as liked.';
            await animeRepo.RemoveLikeAnAnime(mangaId,userId);
            return res.render('partials/RedirectionAlert', { whichId, text, type});

        }else{
            const text = 'Manga has been liked.';
            await animeRepo.LikeAnAnime(mangaId,userId);
            return res.render('partials/RedirectionAlert', { whichId, text, type});

        }
    } catch (error) {
        console.error('Error:', error);
        res.send(`
            <script>
                alert('Internal Server Error');
                window.location.href = '/browse/anime';
            </script>
        `);
        return res.end();
    }
});


router.post('/:mangaId/edit', async (req, res) => {
    try {
        var mangaId = req.params.mangaId;
        var userId = req.user ? req.user.UserID : null;

        var mangaData = {
            AnimeStatus: req.body.status || null,
            ChaptersRead: req.body.chapterProgress || null,
            VolumeProgress: req.body.volumeProgress || null,
            TotalRewatch: req.body.totalRereads || null,
            StartDate: req.body.startDate || null,
            EndDate: req.body.finishDate || null,
            Notes: req.body.notes || null,
            RateGrade: req.body.rate || null,
        };

        var numRows = await animeRepo.editAnimeFromList(mangaId, userId, mangaData);
        res.send(`
        <script>
            alert('Manga information updated successfully.');
            window.location.href = '/browse/manga';
        </script>
        `);
        return res.end();

    } catch (error) {
        console.error('Error:', error);
        res.send(`
        <script>
            alert('Internal Server Error');
            window.location.href = '/browse/manga';
        </script>
        `);
        return res.end();
    }
});

/* ------- MANGA PAGES ACTION -----*/

router.get('/:mangaId/:mangaName', MangaViewAction);
router.get('/:mangaId', MangaViewAction);
router.get('/:mangaId/:mangaName/characters', MangaViewActionCharacters);
router.get('/:mangaId/characters', MangaViewActionCharacters);

async function MangaViewAction(request, response) {
    var mangaId = request.params.mangaId;
    var mangaName = request.params.mangaName;
    var userId = request.user ? request.user.UserID : null;

    try {
        var manga = await animeRepo.getOneManga(mangaId);
        var charactersDetails = await animeRepo.getCharactersByAnimeID(mangaId);

        const animeStatus = userId ? await animeRepo.getAnimeStatus(userId, mangaId) : null;
        var user_info_about_anime = await reviewRepo.getUserViewAnimeInfo(mangaId,userId);
        const is_manga_favourited = await animeRepo.CheckIfAnimeInFavourite(userId,mangaId);

        const StatsCount = {};
        StatsCount.PlanningCount = (await animeRepo.getAllStatusAnime('mset-planning',mangaId))[0]?.statusCount || 0;
        StatsCount.CompleteCount = (await animeRepo.getAllStatusAnime('mset-complete',mangaId))[0]?.statusCount || 0;
        StatsCount.WatchingCount = (await animeRepo.getAllStatusAnime('mset-reading',mangaId))[0]?.statusCount || 0;
        StatsCount.DroppedCount = (await animeRepo.getAllStatusAnime('mset-dropped',mangaId))[0]?.statusCount || 0;
        StatsCount.PausedCount = (await animeRepo.getAllStatusAnime('mset-paused',mangaId))[0]?.statusCount || 0;
        StatsCount.RewatchCount = (await animeRepo.getAllStatusAnime('mset-rereading',mangaId))[0]?.statusCount || 0;

        response.render("single_view/single_manga", { is_manga_favourited, "StatsCount": StatsCount, "user_info_about_anime": user_info_about_anime, "animeStatus": animeStatus, "charactersDetails": charactersDetails, "manga": manga, user: request.user, activePage: 'browse' });

    } catch (error) {
        console.error('Error in MangaViewAction:', error);
        response.status(500).send('Internal Server Error');
    }
}

async function MangaViewActionCharacters(request, response) {
    var mangaId = request.params.mangaId;
    var userId = request.user ? request.user.UserID : null;

    try {
        var manga = await animeRepo.getOneManga(mangaId);
        var charactersDetails = await animeRepo.getCharactersByAnimeID(mangaId);

        const animeStatus = userId ? await animeRepo.getAnimeStatus(userId, mangaId) : null;
        var user_info_about_anime = await reviewRepo.getUserViewAnimeInfo(mangaId,userId);
        const is_manga_favourited = await animeRepo.CheckIfAnimeInFavourite(userId,mangaId);

        response.render("single_view/single_manga_characters", {is_manga_favourited, "user_info_about_anime": user_info_about_anime, "animeStatus": animeStatus, "charactersDetails": charactersDetails, "manga": manga, user: request.user, activePage: 'browse' });
    } catch (error) {
        console.error('Error in MangaViewActionCharacters:', error);
        response.status(500).send('Internal Server Error');
    }
}
  
  
router.get('/:mangaId/:mangaName/user-info', MangaViewActionUserInfo);
router.get('/:mangaId/user-info', MangaViewActionUserInfo);

async function MangaViewActionUserInfo(request, response) {
    var mangaId = request.params.mangaId;
    var userId = request.user.UserID;

    try {
        var manga = await animeRepo.getOneManga(mangaId);
        var charactersDetails = await animeRepo.getCharactersByAnimeID(mangaId);
        const is_manga_favourited = await animeRepo.CheckIfAnimeInFavourite(userId,mangaId);

        const animeStatus = await animeRepo.getAnimeStatus(userId, mangaId);
        var user_info_about_anime = await reviewRepo.getUserViewAnimeInfo(mangaId,userId);

        response.render("single_view/single_manga_userInfo", { is_manga_favourited, "user_info_about_anime": user_info_about_anime, "animeStatus": animeStatus, "charactersDetails": charactersDetails, "manga": manga, user: request.user, activePage: 'browse' });
    } catch (error) {
        console.error('Error in MangaViewActionUserInfo:', error);
        response.status(500).send('Internal Server Error');
    }
}


/* ------- MANGA REVIEWS ACTION -----*/

router.get('/:mangaId/reviews', MangaViewActionReviews);
router.get('/:mangaId/:mangaName/reviews', MangaViewActionReviews);


async function MangaViewActionReviews(request, response) {
    var mangaId = request.params.mangaId;
    var userId = request.user ? request.user.UserID : null;
  
    try {
      var manga = await animeRepo.getOneManga(mangaId);
  
      const animeStatus = userId ? await animeRepo.getAnimeStatus(userId, mangaId) : null;
      const is_manga_favourited = await animeRepo.CheckIfAnimeInFavourite(userId,mangaId);
  

      var who_did_review = await reviewRepo.getInformationOfUserWhoDidAReview(mangaId);
      var UsernamesWhoDidReviews = await reviewRepo.getUserIdOfPeopleWhoDidAReview(mangaId);
      user_info_about_anime = await reviewRepo.getUserViewAnimeInfo(mangaId,userId);
  
   
      // This array takes the informations of user_info_about_anime and adds the Username of the user from UsernamesWhoDidReviews
        const combinedUserInfo = (who_did_review || []).map(review => {
           
        
            const correspondingUser = UsernamesWhoDidReviews ? UsernamesWhoDidReviews.find(user => user.UserID === review.UserID) : null;
        
            if (correspondingUser) {
            return { ...review, UserName: correspondingUser.UserName };
            }
        
            return review; 
            
        });
        
  
  
      response.render("single_view/single_manga_reviews", {
        is_manga_favourited,
        "UsernamesWhoDidReviews": UsernamesWhoDidReviews,
        "combinedUserInfo": combinedUserInfo,
        "animeStatus": animeStatus,
        "manga": manga,
        user: request.user,
        activePage: 'browse'
      });
    } catch (error) {
      console.error('Error in MangaViewActionReviews:', error);
      response.status(500).send('Internal Server Error');
    }
  }


module.exports = router;
