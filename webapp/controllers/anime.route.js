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



async function AnimeViewAction(request, response) {
    var animeId = request.params.animeId;
    var charName = request.params.animeName;

    try {
        // Fetch the anime data
        // Awaits makes sure the promise is resolved before continuing with the execution
        var anime = await animeRepo.getOneAnime(animeId);
        var charactersDetails = await animeRepo.getCharactersByAnimeID(animeId);

        const animeStatus = await animeRepo.getAnimeStatus(request.user.UserID, animeId);

        response.render("single_view/single_anime", { "animeStatus":animeStatus,"charactersDetails": charactersDetails, "anime": anime, user: request.user,  activePage: 'browse'  });
    } catch (error) {
        console.error('Error in AnimeViewAction:', error);
        response.status(500).send('Internal Server Error');
    }
}


async function AnimeViewActionCharacters(request, response) {
    var animeId = request.params.animeId;

    try {
        // Fetch the anime data
        // Awaits makes sure the promise is resolved before continuing with the execution
        var anime = await animeRepo.getOneAnime(animeId);
        var charactersDetails = await animeRepo.getCharactersByAnimeID(animeId);

        response.render("single_view/single_anime_characters", { "charactersDetails": charactersDetails, "anime": anime, user: request.user,  activePage: 'browse'  });
    } catch (error) {
        console.error('Error in AnimeViewActionCharacters:', error);
        response.status(500).send('Internal Server Error');
    }
}

module.exports = router;