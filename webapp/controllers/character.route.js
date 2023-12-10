// controllers/hello.route.js
const express = require('express');
const router = express.Router();
const characterRepo = require('../utils/characters.repository');


router.get('/:characterId/:charName', CharacterViewAction);
router.get('/:characterId', CharacterViewAction);



async function CharacterViewAction(request, response) {
    var characterId = request.params.characterId;
    var charName = request.params.charName;

    try {
        // Fetch the character data
        var character = await characterRepo.getOneCharacter(characterId);
        var related_anime = await characterRepo.getAnimeByCharacterID(characterId);

        response.render("single_view/single_character", { "related_anime":related_anime, "character": character, user: request.user,  activePage: 'browse' });
    } catch (error) {
        console.error('Error in CharacterViewAction:', error);
        response.status(500).send('Internal Server Error');
    }
}

module.exports = router;