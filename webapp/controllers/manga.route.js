// controllers/hello.route.js
const express = require('express');
const router = express.Router();
const animeRepo = require('../utils/anime.repository');

router.get('/:mangaId/:mangaName', MangaViewAction);
router.get('/:mangaId', MangaViewAction);



router.post('/:mangaId/set', async (req, res) => {
    try {
        const { action } = req.body;
        var mangaId = req.params.mangaId;
        const userId = req.user.UserID;
  
        if (action === 'set-complete' || action === 'set-reading' || action === 'set-planning') {
        
            const mangaId = req.body.mangaId || req.params.mangaId;
            const userId = req.user.UserID;
      
          
            await animeRepo.updateAnimeStatus(userId, mangaId, action);
      
            res.send(`
          <script>
            alert('Manga status updated successfully.');
            window.location.href = '/browse/manga';
          </script>
        `);
        return res.end();
          } else {
            
        
            res.send(`
          <script>
            alert('Invalid action.');
            window.location.href = '/browse/manga';
          </script>
        `);
        return res.end();
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
    var userId = request.user.UserID;

    try {
        // Fetch the manga data
        var manga = await animeRepo.getOneManga(mangaId);
        var charactersDetails = await animeRepo.getCharactersByAnimeID(mangaId);
        const animeStatus = await animeRepo.getAnimeStatus(request.user.UserID, mangaId);
        var user_info_about_anime = await animeRepo.getUserAnime(mangaId,userId);

        // To do the stats of an anime, we're gonna fetch those stats from our View_Anime table
        const StatsCount = {};

        StatsCount.PlanningCount = (await animeRepo.getAllStatusAnime('set-planning'))[0]?.statusCount || 0;
        StatsCount.CompleteCount = (await animeRepo.getAllStatusAnime('set-complete'))[0]?.statusCount || 0;
        StatsCount.WatchingCount = (await animeRepo.getAllStatusAnime('set-watching'))[0]?.statusCount || 0;
        StatsCount.DroppedCount = (await animeRepo.getAllStatusAnime('set-dropped'))[0]?.statusCount || 0;
        StatsCount.PausedCount = (await animeRepo.getAllStatusAnime('set-paused'))[0]?.statusCount || 0;
        StatsCount.RewatchCount = (await animeRepo.getAllStatusAnime('set-rewatching'))[0]?.statusCount || 0;
        
        response.render("single_view/single_manga", { "StatsCount":StatsCount, "user_info_about_anime":user_info_about_anime, "animeStatus":animeStatus,"charactersDetails": charactersDetails, "manga": manga, user: request.user,  activePage: 'browse'  });
    
    } catch (error) {
        console.error('Error in MangaViewAction:', error);
        response.status(500).send('Internal Server Error');
    }
}


async function MangaViewActionCharacters(request, response) {
    var mangaId = request.params.mangaId;
    var userId = request.user.UserID;

    try {

        var manga = await animeRepo.getOneManga(mangaId);
        var charactersDetails = await animeRepo.getCharactersByAnimeID(mangaId);

        const animeStatus = await animeRepo.getAnimeStatus(request.user.UserID, mangaId);
        var user_info_about_anime = await animeRepo.getUserAnime(mangaId,userId);

        response.render("single_view/single_manga_characters", { "user_info_about_anime":user_info_about_anime, "animeStatus":animeStatus,"charactersDetails": charactersDetails, "manga": manga, user: request.user,  activePage: 'browse'  });
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
      // Fetch the anime data
      // Awaits makes sure the promise is resolved before continuing with the execution
      var manga = await animeRepo.getOneManga(mangaId);
      var charactersDetails = await animeRepo.getCharactersByAnimeID(mangaId);

      const animeStatus = await animeRepo.getAnimeStatus(request.user.UserID, mangaId);
      var user_info_about_anime = await animeRepo.getUserAnime(mangaId,userId);
      response.render("single_view/single_manga_userInfo", { "user_info_about_anime":user_info_about_anime, "animeStatus":animeStatus,"charactersDetails": charactersDetails, "manga": manga, user: request.user,  activePage: 'browse'  });
  } catch (error) {
      console.error('Error in MangaViewActionUserInfo:', error);
      response.status(500).send('Internal Server Error');
  }
}

router.post('/:mangaId/edit', async (req, res) => {
  try {
  
      var mangaId = req.params.mangaId;
      var userId = req.user.UserID;

      var mangaData = {
        AnimeStatus: req.body.status || null,
        ChaptersRead: req.body.chapterProgress || null,
        VolumeProgress: req.body.volumeProgress || null,
        TotalRewatch: req.body.totalRereads || null,
        StartDate: req.body.startDate || null,
        EndDate: req.body.finishDate || null,
        Notes: req.body.notes || null,
        RateGrade:req.body.rate || null,
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
module.exports = router;