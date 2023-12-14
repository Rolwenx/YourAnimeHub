const express = require('express');
const router = express.Router();
const animeRepo = require('../utils/anime.repository');
const reviewRepo = require('../utils/review.repository');


router.post('/:animeId/set', async (req, res) => {
    try {
        const { action } = req.body;
        var animeId = req.params.animeId;
        const userId = req.user ? req.user.UserID : null;
        const type = "anime";
        const whichId = animeId;
        
        if (!userId) {
            const text = 'Unauthorized. Please log in to perform this action.';
            
            return res.render('partials/RedirectionAlert', { whichId, text, type});
        }

        if (action === 'aset-complete' || action === 'aset-watching' || action === 'aset-planning') {
            await animeRepo.updateAnimeStatus(userId, animeId, action);
            const text = 'Anime status updated successfully.';
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
                window.location.href = '/browse/anime';
            </script>
        `);
        return res.end();
    }
});


router.post('/:animeId/edit', async (req, res) => {
    try {
        var animeId = req.params.animeId;
        var userId = req.user ? req.user.UserID : null;

        var mangaData = {
            AnimeStatus: req.body.status || null,
            EpisodeProgress: req.body.episodeProgress || null,
            TotalRewatch: req.body.totalRewatches || null,
            StartDate: req.body.startDate || null,
            EndDate: req.body.finishDate || null,
            Notes: req.body.notes || null,
            RateGrade: req.body.rate || null,
        };

        var numRows = await animeRepo.editAnimeFromList(animeId, userId, mangaData);
        res.send(`
        <script>
            alert('Anime information updated successfully.');
            window.location.href = '/browse/anime';
        </script>
        `);
        return res.end();

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


router.post('/:animeId/like', async (req, res) => {
    try {
        var animeId = req.params.animeId;
        const userId = req.user ? req.user.UserID : null;
        const type = "anime";
        const whichId = animeId;
        
        if (!userId) {
            const text = 'Unauthorized. Please log in to perform this action.';
            
            return res.render('partials/RedirectionAlert', { whichId, text, type});
        }
        const has_user_liked = await animeRepo.CheckIfUserHasLikedAnime(userId,animeId);

        if(has_user_liked == true){
            const text = 'Anime has removed as liked.';
            await animeRepo.RemoveLikeAnAnime(animeId,userId);
            return res.render('partials/RedirectionAlert', { whichId, text, type});

        }else{
            const text = 'Anime has been liked.';
            await animeRepo.LikeAnAnime(animeId,userId);
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


/* ------- MANGA PAGES ACTION -----*/

router.get('/:animeId/:animeName', AnimeViewAction);
router.get('/:animeId', AnimeViewAction);
router.get('/:animeId/:animeName/characters', AnimeViewActionCharacters);
router.get('/:animeId/characters', AnimeViewActionCharacters);
router.get('/:animeId/:animeName/reviews', AnimeViewActionReviews);
router.get('/:animeId/reviews', AnimeViewActionReviews);

async function AnimeViewAction(request, response) {
    var animeId = request.params.animeId;
    var animeName = request.params.animeName;
    var userId = request.user ? request.user.UserID : null;

    try {
        var anime = await animeRepo.getOneAnime(animeId);
        var charactersDetails = await animeRepo.getCharactersByAnimeID(animeId);

        const animeStatus = userId ? await animeRepo.getAnimeStatus(userId, animeId) : null;
        var user_info_about_anime = await reviewRepo.getUserViewAnimeInfo(animeId,userId);
        const is_anime_favourited = await animeRepo.CheckIfAnimeInFavourite(userId,animeId);

        const StatsCount = {};
        StatsCount.Favourited = await animeRepo.getHowMuchAnimeHasBeenFavourited(animeId);
        StatsCount.PlanningCount = (await animeRepo.getAllStatusAnime('aset-planning',animeId))[0]?.statusCount || 0;
        StatsCount.CompleteCount = (await animeRepo.getAllStatusAnime('aset-complete',animeId))[0]?.statusCount || 0;
        StatsCount.WatchingCount = (await animeRepo.getAllStatusAnime('aset-watching',animeId))[0]?.statusCount || 0;
        StatsCount.DroppedCount = (await animeRepo.getAllStatusAnime('aset-dropped',animeId))[0]?.statusCount || 0;
        StatsCount.PausedCount = (await animeRepo.getAllStatusAnime('aset-paused',animeId))[0]?.statusCount || 0;
        StatsCount.RewatchCount = (await animeRepo.getAllStatusAnime('aset-rewatching',animeId))[0]?.statusCount || 0;

        response.render("single_view/single_anime", { is_anime_favourited,"StatsCount": StatsCount, "user_info_about_anime": user_info_about_anime, "animeStatus": animeStatus, "charactersDetails": charactersDetails, "anime": anime, user: request.user, activePage: 'browse' });

    } catch (error) {
        console.error('Error in AnimeViewAction:', error);
        response.status(500).send('Internal Server Error');
    }
}

async function AnimeViewActionCharacters(request, response) {
    var animeId = request.params.animeId;
    var userId = request.user ? request.user.UserID : null;

    try {
        var anime = await animeRepo.getOneAnime(animeId);
        var charactersDetails = await animeRepo.getCharactersByAnimeID(animeId);
        const is_anime_favourited = await animeRepo.CheckIfAnimeInFavourite(userId,animeId);

        const animeStatus = userId ? await animeRepo.getAnimeStatus(userId, animeId) : null;
        var user_info_about_anime = await reviewRepo.getUserViewAnimeInfo(animeId,userId);

        response.render("single_view/single_anime_characters", {is_anime_favourited, "user_info_about_anime": user_info_about_anime, "animeStatus": animeStatus, "charactersDetails": charactersDetails, "anime": anime, user: request.user, activePage: 'browse' });
    } catch (error) {
        console.error('Error in AnimeViewActionCharacters:', error);
        response.status(500).send('Internal Server Error');
    }
}

async function AnimeViewActionReviews(request, response) {
    var animeId = request.params.animeId;
    var userId = request.user ? request.user.UserID : null;
  
    try {
      var anime = await animeRepo.getOneAnime(animeId);
  
      const animeStatus = userId ? await animeRepo.getAnimeStatus(userId, animeId) : null;
      const is_anime_favourited = await animeRepo.CheckIfAnimeInFavourite(userId,animeId);
  

      var who_did_review = await reviewRepo.getInformationOfUserWhoDidAReview(animeId);
      var UsernamesWhoDidReviews = await reviewRepo.getUserIdOfPeopleWhoDidAReview(animeId);
      user_info_about_anime = await reviewRepo.getUserViewAnimeInfo(animeId,userId);
  
   
      // This array takes the informations of user_info_about_anime and adds the Username of the user from UsernamesWhoDidReviews
        const combinedUserInfo = (who_did_review || []).map(review => {
           
        
            const correspondingUser = UsernamesWhoDidReviews ? UsernamesWhoDidReviews.find(user => user.UserID === review.UserID) : null;
        
            if (correspondingUser) {
            return { ...review, UserName: correspondingUser.UserName };
            }
        
            return review; 
            
        });
        console.log("combinedUserInfo",combinedUserInfo);
        
  
  
      response.render("single_view/single_anime_reviews", {
        is_anime_favourited,
        "UsernamesWhoDidReviews": UsernamesWhoDidReviews,
        "combinedUserInfo": combinedUserInfo,
        "animeStatus": animeStatus,
        "anime": anime,
        user: request.user,
        activePage: 'browse'
      });
    } catch (error) {
      console.error('Error in AnimeViewActionReviews:', error);
      response.status(500).send('Internal Server Error');
    }
  }
  
  
router.get('/:animeId/:animeName/user-info', AnimeViewActionUserInfo);
router.get('/:animeId/user-info', AnimeViewActionUserInfo);

async function AnimeViewActionUserInfo(request, response) {
    var animeId = request.params.animeId;
    var userId = request.user.UserID;

    try {
        var anime = await animeRepo.getOneAnime(animeId);
        var charactersDetails = await animeRepo.getCharactersByAnimeID(animeId);
        const is_anime_favourited = await animeRepo.CheckIfAnimeInFavourite(userId,animeId);

        const animeStatus = await animeRepo.getAnimeStatus(userId, animeId);
        var user_info_about_anime = await reviewRepo.getUserViewAnimeInfo(animeId,userId);
        console.log(user_info_about_anime);
        console.log(user_info_about_anime.ReviewID);

        response.render("single_view/single_anime_userInfo", { is_anime_favourited,"user_info_about_anime": user_info_about_anime, "animeStatus": animeStatus, "charactersDetails": charactersDetails, "anime": anime, user: request.user, activePage: 'browse' });
    } catch (error) {
        console.error('Error in AnimeViewActionUserInfo:', error);
        response.status(500).send('Internal Server Error');
    }
}

module.exports = router;
