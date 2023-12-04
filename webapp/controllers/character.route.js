// controllers/hello.route.js
const express = require('express');
const router = express.Router();
const characterRepo = require('../utils/characters.repository');


router.get('/:characterId/:charName', adminCharacterViewAction);
router.get('/:characterId', adminCharacterViewAction);


async function adminCharacterViewAction(request, response) {
    var characterId = request.params.characterId;
    var charName = request.params.charName;

    try {
        // Fetch the character data
        var character = await characterRepo.getOneCharacter(characterId);
        console.log(character);

        response.render("single_view/single_character", { "character": character, user: request.user });
    } catch (error) {
        console.error('Error in adminCharacterViewAction:', error);
        response.status(500).send('Internal Server Error');
    }
}

module.exports = router;