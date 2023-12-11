// controllers/hello.route.js
const express = require('express');
const router = express.Router();
const animeRepo = require('../utils/anime.repository');


router.get('/:animeId/:animeName', AnimeViewAction);
router.get('/:animeId', AnimeViewAction);

router.post('/:animeId/set', async (req, res) => {
    try {
        const { action } = req.body;
        var animeId = req.params.animeId;
        const userId = req.user.UserID;
  
        if (action === 'set-complete' || action === 'set-watching' || action === 'set-planning') {
            // Extract animeId from the form data or request parameters
            const animeId = req.body.animeId || req.params.animeId;
            const userId = req.user.UserID;
      
          
            await animeRepo.updateAnimeStatus(userId, animeId, action);
      
            res.send(`
          <script>
            alert('Anime status updated successfully.');
            window.location.href = '/browse/anime';
          </script>
        `);
        return res.end();
          } else {
            
        
            res.send(`
          <script>
            alert('Invalid action.');
            window.location.href = '/browse/anime';
          </script>
        `);
        return res.end();
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

router.get('/:animeId/:animeName/characters', AnimeViewActionCharacters);
router.get('/:animeId/characters', AnimeViewActionCharacters);
router.get('/:animeId/:animeName/reviews', AnimeViewActionReviews);
router.get('/:animeId/reviews', AnimeViewActionReviews);



async function AnimeViewAction(request, response) {
    var animeId = request.params.animeId;
    var charName = request.params.animeName;
    var userId = request.user.UserID;

    try {
        // Fetch the anime data
        // Awaits makes sure the promise is resolved before continuing with the execution
        var anime = await animeRepo.getOneAnime(animeId);
        var charactersDetails = await animeRepo.getCharactersByAnimeID(animeId);

        const animeStatus = await animeRepo.getAnimeStatus(request.user.UserID, animeId);
        var user_info_about_anime = await animeRepo.getUserAnime(animeId,userId);

        // To do the stats of an anime, we're gonna fetch those stats from our View_Anime table
        const StatsCount = {};

        StatsCount.PlanningCount = (await animeRepo.getAllStatusAnime('set-planning'))[0]?.statusCount || 0;
        StatsCount.CompleteCount = (await animeRepo.getAllStatusAnime('set-complete'))[0]?.statusCount || 0;
        StatsCount.WatchingCount = (await animeRepo.getAllStatusAnime('set-watching'))[0]?.statusCount || 0;
        StatsCount.DroppedCount = (await animeRepo.getAllStatusAnime('set-dropped'))[0]?.statusCount || 0;
        StatsCount.PausedCount = (await animeRepo.getAllStatusAnime('set-paused'))[0]?.statusCount || 0;
        StatsCount.RewatchCount = (await animeRepo.getAllStatusAnime('set-rewatching'))[0]?.statusCount || 0;
  
        

        
        response.render("single_view/single_anime", { "StatsCount":StatsCount, "user_info_about_anime":user_info_about_anime, "animeStatus":animeStatus,"charactersDetails": charactersDetails, "anime": anime, user: request.user,  activePage: 'browse'  });
    

    } catch (error) {
        console.error('Error in AnimeViewAction:', error);
        response.status(500).send('Internal Server Error');
    }
}


async function AnimeViewActionCharacters(request, response) {
    var animeId = request.params.animeId;
    var userId = request.user.UserID;

    try {
        var anime = await animeRepo.getOneAnime(animeId);
        var charactersDetails = await animeRepo.getCharactersByAnimeID(animeId);

        const animeStatus = await animeRepo.getAnimeStatus(request.user.UserID, animeId);
        var user_info_about_anime = await animeRepo.getUserAnime(animeId,userId);
        response.render("single_view/single_anime_characters", { "user_info_about_anime":user_info_about_anime, "animeStatus":animeStatus,"charactersDetails": charactersDetails, "anime": anime, user: request.user,  activePage: 'browse'  });
    } catch (error) {
        console.error('Error in AnimeViewActionCharacters:', error);
        response.status(500).send('Internal Server Error');
    }
}

async function AnimeViewActionReviews(request, response) {
  var animeId = request.params.animeId;
  var userId = request.user.UserID;

  try {
      var anime = await animeRepo.getOneAnime(animeId);
      var charactersDetails = await animeRepo.getCharactersByAnimeID(animeId);

      const animeStatus = await animeRepo.getAnimeStatus(request.user.UserID, animeId);
      var user_info_about_anime = await animeRepo.getUserAnime(animeId,userId);

      var UsernamesWhoDidReviews = await animeRepo.getAllReviewsByAnimeId(animeId);
      response.render("single_view/single_anime_reviews", { 
        "UsernamesWhoDidReviews": UsernamesWhoDidReviews,
        "user_info_about_anime":user_info_about_anime,
         "animeStatus":animeStatus,
         "charactersDetails": charactersDetails, 
         "anime": anime, 
         user: request.user,  
         activePage: 'browse'  });
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
      // Fetch the anime data
      // Awaits makes sure the promise is resolved before continuing with the execution
      var anime = await animeRepo.getOneAnime(animeId);
      var charactersDetails = await animeRepo.getCharactersByAnimeID(animeId);

      const animeStatus = await animeRepo.getAnimeStatus(request.user.UserID, animeId);
      var user_info_about_anime = await animeRepo.getUserAnime(animeId,userId);
      response.render("single_view/single_anime_userInfo", { "user_info_about_anime":user_info_about_anime, "animeStatus":animeStatus,"charactersDetails": charactersDetails, "anime": anime, user: request.user,  activePage: 'browse'  });
  } catch (error) {
      console.error('Error in AnimeViewActionUserInfo:', error);
      response.status(500).send('Internal Server Error');
  }
}

router.post('/:animeId/edit', async (req, res) => {
  try {
  
      var animeId = req.params.animeId;
      var userId = req.user.UserID;

      var mangaData = {
        AnimeStatus: req.body.status || null,
        EpisodeProgress: req.body.episodeProgress || null,
        TotalRewatch: req.body.totalRewatches || null,
        StartDate: req.body.startDate || null,
        EndDate: req.body.finishDate || null,
        Notes: req.body.notes || null,
        RateGrade:req.body.rate || null,
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


module.exports = router;