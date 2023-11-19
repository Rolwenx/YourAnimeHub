// Admin route.js
const express = require('express');
const router = express.Router();
const animeRepo = require('../utils/anime.repository'); // Update the path
const quoteRepo = require('../utils/quote.repository'); // Add quote repository import
const characterRepo = require('../utils/characters.repository');


// Admin routes
router.get('/admin', adminHomeAction);
router.get('/admin/animes', adminAnimeListAction);
router.get('/admin/mangas', adminMangaListAction);
router.get('/admin/quotes', adminQuoteListAction);
router.get('/admin/characters', adminCharacterListAction);

router.get('/admin/animes/edit/:animeId', adminAnimeEditAction);
router.post('/admin/animes/update/:animeId', adminAnimeUpdateAction);
router.get('/admin/animes/del/:animeId', adminAnimeDelAction);

router.get('/admin/mangas/edit/:mangaId', adminMangaEditAction);
router.post('/admin/mangas/update/:mangaId', adminMangaUpdateAction);
router.get('/admin/mangas/del/:mangaId', adminMangaDelAction);

router.get('/admin/quotes/edit/:quoteId', adminQuoteEditAction);
router.post('/admin/quotes/update/:quoteId', adminQuoteUpdateAction);
router.get('/admin/quotes/del/:quoteId', adminQuoteDelAction);

router.get('/admin/characters/edit/:characterId', adminCharacterEditAction);
router.post('/admin/characters/update/:characterId', adminCharacterUpdateAction);
router.get('/admin/characters/del/:characterId', adminCharacterDelAction);

router.get('/admin/animes/add', adminAnimeAddAction);
router.post('/admin/animes/create', adminAnimeCreateAction);

router.get('/admin/mangas/add', adminMangaAddAction);
router.post('/admin/mangas/create', adminMangaCreateAction);

router.get('/admin/quotes/add', adminQuoteAddAction);
router.post('/admin/quotes/create', adminQuoteCreateAction);

router.get('/admin/characters/add', adminCharacterAddAction);
router.post('/admin/characters/create', adminCharacterCreateAction);

// Admin Home route
function adminHomeAction(request, res) {
    res.render('admin/admin', { favourites: [] });
}
// Admin Anime routes
async function adminAnimeListAction(request, response) {
    var animeList = await animeRepo.getAllAnime();
    response.render("admin/admin_anime", { "animeList": animeList });
}

async function adminAnimeEditAction(request, response) {
    var animeId = request.params.animeId;
    var anime = await animeRepo.getOneAnime(animeId);
    response.render("admin/admin_edit_anime", { "anime": anime });
}

async function adminAnimeUpdateAction(request, response) {
    var animeId = request.params.animeId;
    var animeData = { /* Extract data from request.body */ };
    var numRows = await animeRepo.editOneAnime(animeId, animeData);
    response.redirect("/admin/animes");
}

async function adminAnimeDelAction(request, response) {
    var animeId = request.params.animeId;
    var numRows = await animeRepo.delOneAnime(animeId);
    response.redirect("/admin/animes");
}

async function adminAnimeAddAction(request, response) {
    response.render("admin/admin_add_anime", { /* Additional data if needed */ });
}

async function adminAnimeCreateAction(request, response) {
    var animeData = {
        TitleEnglish: request.body.titleEnglish,
        TitleRomaji: request.body.titleRomaji,
        TitleNative: request.body.titleNative,
        Genre: request.body.genre,
        ReleaseDate: request.body.releaseDate,
        EndDate: request.body.endDate,
        AnimeStatus: request.body.animeStatus,
        Synopsis: request.body.synopsis,
        PopularityPosition: null,
        CoverImageURL: request.body.coverImageURL,
        BackgroundImageURL: request.body.backgroundImageURL,
        StreamingPlatformURL: request.body.streamingPlatformURL,
        AnimeFormat: "Anime",
        EpisodeDuration: request.body.episodeDuration,
        EpisodeCount: request.body.episodeCount,
        Chapters: request.body.chapters,
        Volumes: request.body.volumes
    };
    var animeId = await animeRepo.addOneAnime(animeData);
    response.redirect("/admin/animes");
}

// Admin Manga routes
async function adminMangaListAction(request, response) {
    var mangaList = await animeRepo.getAllMangas();
    response.render("admin/admin_manga", { "mangaList": mangaList });
}

async function adminMangaEditAction(request, response) {
    var mangaId = request.params.mangaId;
    var manga = await animeRepo.getOneManga(mangaId);
    response.render("admin/admin_edit_manga", { "manga": manga });
}

async function adminMangaUpdateAction(request, response) {
    var mangaId = request.params.mangaId;
    var mangaData = { /* Extract data from request.body */ };
    var numRows = await animeRepo.editOneManga(mangaId, mangaData);
    response.redirect("/admin/mangas");
}

async function adminMangaDelAction(request, response) {
    var mangaId = request.params.mangaId;
    var numRows = await animeRepo.delOneManga(mangaId);
    response.redirect("/admin/mangas");
}

async function adminMangaAddAction(request, response) {
    response.render("admin/admin_add_manga", { /* Additional data if needed */ });
}

async function adminMangaCreateAction(request, response) {
    var mangaData = {
        TitleEnglish: request.body.titleEnglish,
        TitleRomaji: request.body.titleRomaji,
        TitleNative: request.body.titleNative,
        Genre: request.body.genre,
        ReleaseDate: request.body.releaseDate,
        EndDate: request.body.endDate,
        AnimeStatus: request.body.mangaStatus,
        Synopsis: request.body.synopsis,
        PopularityPosition: null,
        CoverImageURL: request.body.coverImageURL,
        BackgroundImageURL: request.body.backgroundImageURL,
        StreamingPlatformURL: request.body.streamingPlatformURL,
        AnimeFormat: "Anime",
        EpisodeDuration: request.body.episodeDuration,
        EpisodeCount: request.body.episodeCount,
        Chapters: request.body.chapters,
        Volumes: request.body.volumes
    };
    var mangaId = await animeRepo.addOneAnime(mangaData);
    response.redirect("/admin/mangas");
}

// Admin Quote routes
async function adminQuoteListAction(request, response) {
    var quoteList = await quoteRepo.getAllQuotes();
    response.render("admin/admin_quote", { "quoteList": quoteList });
}

async function adminQuoteEditAction(request, response) {
    var quoteId = request.params.quoteId;
    var quote = await quoteRepo.getOneQuote(quoteId);
    response.render("admin/admin_edit_quote", { "quote": quote });
}

async function adminQuoteUpdateAction(request, response) {
    var quoteId = request.params.quoteId;
    var quoteData = { /* Extract data from request.body */ };
    var numRows = await quoteRepo.editOneQuote(quoteId, quoteData);
    response.redirect("/admin/quotes");
}

async function adminQuoteDelAction(request, response) {
    var quoteId = request.params.quoteId;
    var numRows = await quoteRepo.delOneQuote(quoteId);
    response.redirect("/admin/quotes");
}

async function adminQuoteAddAction(request, response) {
    response.render("admin/admin_add_quote", { /* Additional data if needed */ });
}

async function adminQuoteCreateAction(request, response) {
    try {
        var quoteData = {
            QuoteText: request.body.quoteText,
        };

        // Check if the anime exists in the database
        const animeTitle = request.body.animeTitle;
        const anime = await animeRepo.getAnimeIdByName(animeTitle);
        if (!anime) {
            return response.send("alert('The anime does not exist in the database. Add the anime first before entering the quote.');");
        }

        // Check if the character exists in the database
        const characterName = request.body.characterName;
        const character = await characterRepo.getCharacterIdByName(characterName);
        if (!character) {
            // Character not found
            return response.send("alert('The character does not exist in the database. Add the character first before entering the quote.');");
        }

        // Both anime and character exist in the database, add the quote
        quoteData.CharacterID = character.CharacterID;
        quoteData.AnimeID = anime.AnimeID;
        var quoteId = await quoteRepo.addOneQuote(quoteData);

        response.redirect("/admin/quotes");
    } catch (error) {
        console.log(error);
        // Handle other errors as needed
        response.status(500).send("Internal Server Error");
    }
}



// Admin Character routes
async function adminCharacterListAction(request, response) {
    var characterList = await characterRepo.getAllCharacters();
    response.render("admin/admin_character", { "characterList": characterList });
}

async function adminCharacterEditAction(request, response) {
    var characterId = request.params.characterId;
    var character = await characterRepo.getOneCharacter(characterId);
    response.render("admin/admin_edit_character", { "character": character });
}

async function adminCharacterUpdateAction(request, response) {
    var characterId = request.params.characterId;
    var characterData = { /* Extract data from request.body */ };
    var numRows = await characterRepo.editOneCharacter(characterId, characterData);
    response.redirect("/admin/characters");
}

async function adminCharacterDelAction(request, response) {
    var characterId = request.params.characterId;
    var numRows = await characterRepo.delOneCharacter(characterId);
    response.redirect("/admin/characters");
}

async function adminCharacterAddAction(request, response) {
    response.render("admin/admin_add_character", { /* Additional data if needed */ });
}

async function adminCharacterCreateAction(request, response) {
    var characterData = { 
        CharName: request.body.charName,
        Birthday: request.body.titleRomaji,
        Age: request.body.charAge,
        Gender: request.body.charGender,
        BloodType: request.body.charBloodtype,
        Height: request.body.charHeight,
        Description: request.body.charDesc,
        ImageURL: request.body.charImageUrl,
        // Check if the checkbox is selected, set isMainCharacter to true, otherwise false
        isMainCharacter: request.body.isMainCharacter === 'on',
        Family: request.body.family,
        NamesGiven: request.body.charNames,
        HiddenSurnames: request.body.charHiddenNames,
        SpecificField1: request.body.charMoreInfo
     };
    var characterId = await characterRepo.addOneCharacter(characterData);
    response.redirect("/admin/characters");
}

module.exports = router;

