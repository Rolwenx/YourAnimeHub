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

router.get('/:mangaId/:animeName/characters', MangaViewActionCharacters);
router.get('/:mangaId/characters', MangaViewActionCharacters);


async function MangaViewAction(request, response) {
    var mangaId = request.params.mangaId;
    var mangaName = request.params.animeName;
    try {
        // Fetch the manga data
        var manga = await animeRepo.getOneManga(mangaId);
        var charactersDetails = await animeRepo.getCharactersByAnimeID(mangaId);
        const mangaStatus = await animeRepo.getAnimeStatus(request.user.UserID, mangaId);

        response.render("single_view/single_manga", { "mangaStatus":mangaStatus,"charactersDetails": charactersDetails, "manga": manga, user: request.user,  activePage: 'browse'});
    } catch (error) {
        console.error('Error in MangaViewAction:', error);
        response.status(500).send('Internal Server Error');
    }
}


async function MangaViewActionCharacters(request, response) {
    var mangaId = request.params.mangaId;

    try {
        var manga = await animeRepo.getOneManga(mangaId);
        var charactersDetails = await animeRepo.getCharactersByAnimeID(mangaId);

        response.render("single_view/single_manga_characters", { "charactersDetails": charactersDetails, "manga": manga, user: request.user,  activePage: 'browse'  });
    } catch (error) {
        console.error('Error in MangaViewActionCharacters:', error);
        response.status(500).send('Internal Server Error');
    }
}
module.exports = router;