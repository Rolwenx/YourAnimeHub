const express = require('express');
const router = express.Router();
const animeRepo = require('../utils/anime.repository');
const reviewRepo = require('../utils/review.repository');

router.get('/:mangaId/:mangaName', MangaViewAction);
router.get('/:mangaId', MangaViewAction);

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

        if (action === 'set-complete' || action === 'set-reading' || action === 'set-planning') {
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
        var user_info_about_anime = await reviewRepo.getInformationOfUserWhoDidAReview(mangaId);

        const StatsCount = {};
        StatsCount.PlanningCount = (await animeRepo.getAllStatusAnime('set-planning',mangaId))[0]?.statusCount || 0;
        StatsCount.CompleteCount = (await animeRepo.getAllStatusAnime('set-complete',mangaId))[0]?.statusCount || 0;
        StatsCount.WatchingCount = (await animeRepo.getAllStatusAnime('set-watching',mangaId))[0]?.statusCount || 0;
        StatsCount.DroppedCount = (await animeRepo.getAllStatusAnime('set-dropped',mangaId))[0]?.statusCount || 0;
        StatsCount.PausedCount = (await animeRepo.getAllStatusAnime('set-paused',mangaId))[0]?.statusCount || 0;
        StatsCount.RewatchCount = (await animeRepo.getAllStatusAnime('set-rewatching',mangaId))[0]?.statusCount || 0;

        response.render("single_view/single_manga", { "StatsCount": StatsCount, "user_info_about_anime": user_info_about_anime, "animeStatus": animeStatus, "charactersDetails": charactersDetails, "manga": manga, user: request.user, activePage: 'browse' });

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
        var user_info_about_anime = await reviewRepo.getInformationOfUserWhoDidAReview(mangaId);

        response.render("single_view/single_manga_characters", { "user_info_about_anime": user_info_about_anime, "animeStatus": animeStatus, "charactersDetails": charactersDetails, "manga": manga, user: request.user, activePage: 'browse' });
    } catch (error) {
        console.error('Error in MangaViewActionCharacters:', error);
        response.status(500).send('Internal Server Error');
    }
}

router.get('/:mangaId/:mangaName/user-info', MangaViewActionUserInfo);
router.get('/:mangaId/user-info', MangaViewActionUserInfo);

async function MangaViewActionUserInfo(request, response) {
    var mangaId = request.params.mangaId;
    var userId = request.user ? request.user.UserID : null;

    try {
        var manga = await animeRepo.getOneManga(mangaId);
        var charactersDetails = await animeRepo.getCharactersByAnimeID(mangaId);

        const animeStatus = userId ? await animeRepo.getAnimeStatus(userId, mangaId) : null;
        var user_info_about_anime = userId ? await reviewRepo.getUserAnime(mangaId, userId) : null;

        response.render("single_view/single_manga_userInfo", { "user_info_about_anime": user_info_about_anime, "animeStatus": animeStatus, "charactersDetails": charactersDetails, "manga": manga, user: request.user, activePage: 'browse' });
    } catch (error) {
        console.error('Error in MangaViewActionUserInfo:', error);
        response.status(500).send('Internal Server Error');
    }
}

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

router.get('/:mangaId/:mangaName/reviews', MangaViewActionReviews);
router.get('/:mangaId/reviews', MangaViewActionReviews);

async function MangaViewActionReviews(request, response) {
    var mangaId = request.params.mangaId;
    var userId = request.user ? request.user.UserID : null;
  
    try {
      var manga = await animeRepo.getOneManga(mangaId);
  
      const animeStatus = userId ? await animeRepo.getAnimeStatus(userId, mangaId) : null;
  
      var user_info_about_anime = await reviewRepo.getInformationOfUserWhoDidAReview(mangaId);
      var UsernamesWhoDidReviews = await reviewRepo.getUserIdOfPeopleWhoDidAReview(mangaId);
  
        const combinedUserInfo = (user_info_about_anime || []).map(review => {
        
            const correspondingUser = UsernamesWhoDidReviews ? UsernamesWhoDidReviews.find(user => user.UserID === review.UserID) : null;
        
            if (correspondingUser) {
            return { ...review, UserName: correspondingUser.UserName };
            }
        
            return review; // In case no matching user is found
        });
  
  
      console.log("CombinedUserInfo", combinedUserInfo);
  
      response.render("single_view/single_manga_reviews", {
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
