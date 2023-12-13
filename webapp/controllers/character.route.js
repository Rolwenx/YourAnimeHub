const express = require('express');
const router = express.Router();
const characterRepo = require('../utils/characters.repository');

router.get('/:characterId/:charName', CharacterViewAction);
router.get('/:characterId', CharacterViewAction);

async function CharacterViewAction(request, response) {
    const characterId = request.params.characterId;
    const charName = request.params.charName;
    const userId = request.user ? request.user.UserID : null;

    try {
        // Fetch the character data
        const character = await characterRepo.getOneCharacter(characterId);
        const related_anime = await characterRepo.getAnimeByCharacterID(characterId);
        const is_character_favourited = await characterRepo.CheckIfCharacterInFavourite(userId,characterId);

        response.render("single_view/single_character", { 
            is_character_favourited,
            "related_anime":related_anime, 
            "character": character, 
            user: request.user,  
            activePage: 'browse' });
    } catch (error) {
        console.error('Error in CharacterViewAction:', error);
        response.status(500).send('Internal Server Error');
    }
}

module.exports = router;
