// Admin route.js
const express = require('express');
const router = express.Router();
const animeRepo = require('../utils/anime.repository');
const quoteRepo = require('../utils/quote.repository'); 
const characterRepo = require('../utils/characters.repository');


// Admin routes
router.get('/admin', adminHomeAction);
router.get('/admin/animes', adminAnimeListAction);
router.get('/admin/mangas', adminMangaListAction);
router.get('/admin/quotes', adminQuoteListAction);
router.get('/admin/characters', adminCharacterListAction);


router.get('/admin/animes/edit/:animeId/:animeName', adminAnimeEditAction);
router.post('/admin/animes/update/:animeId/:animeName', adminAnimeUpdateAction);
router.get('/admin/animes/delete/:animeId/:animeName', adminAnimeDelAction);

router.get('/admin/mangas/edit/:mangaId/:mangaName', adminMangaEditAction);
router.post('/admin/mangas/update/:mangaId/:mangaName', adminMangaUpdateAction);
router.get('/admin/mangas/delete/:mangaId/:mangaName', adminMangaDelAction);

router.get('/admin/quotes/edit/:quoteId', adminQuoteEditAction);
router.post('/admin/quotes/update/:quoteId', adminQuoteUpdateAction);
router.get('/admin/quotes/delete/:quoteId', adminQuoteDelAction);

router.get('/admin/characters/edit/:characterId/:characterName', adminCharacterEditAction);
router.post('/admin/characters/update/:characterId/:characterName', adminCharacterUpdateAction);
router.get('/admin/characters/delete/:characterId/:characterName', adminCharacterDelAction);

router.get('/admin/animes/add', adminAnimeAddAction);
router.post('/admin/animes/create',adminAnimeCreateAction);


router.get('/admin/mangas/add', adminMangaAddAction);
router.post('/admin/mangas/create', adminMangaCreateAction);

router.get('/admin/quotes/add', adminQuoteAddAction);
router.post('/admin/quotes/create', adminQuoteCreateAction);

router.get('/admin/characters/add', adminCharacterAddAction);
router.post('/admin/characters/create', adminCharacterCreateAction);

// Admin Home route
async function adminHomeAction(request, res) {
    
    try {

    
        // We fetch the list of anime in database
        const animeList = await animeRepo.getAllAnime();
        const mangaList = await animeRepo.getAllMangas(); 
        const quoteList = await quoteRepo.getAllQuotes();
        const characterList = await characterRepo.getAllCharacters();

        // We feth the number of anime in database
        const animeCount = animeList.length;
        MangaCount = mangaList.length;
        const quoteCount = quoteList.length;
        const characterCount = characterList.length;

        res.render('admin/admin', {
            animeCount,
            MangaCount,
            quoteCount,
            characterCount,
            animeList,
            characterList,
            mangaList,
            quoteList,
        });
    } catch (error) {
        console.error('Error in adminHomeAction:', error);
        res.status(500).send('Internal Server Error');
    }
    
}
// Admin Anime routes
async function adminAnimeListAction(request, response) {
    try {
        var animeList = await animeRepo.getAllAnime();
        
        response.render("admin/admin_anime", { "animeList": animeList });
    } catch (error) {
        console.error('Error in adminAnimeListAction:', error);
        response.status(500).send('Internal Server Error');
    }
}


async function adminAnimeEditAction(request, response) {
    var animeId = request.params.animeId;
    var animeName = request.params.animeName;

    try {
        // Fetch the anime data
        var anime = await animeRepo.getOneAnime(animeId);

        response.render("admin/admin_edit_anime", { "anime": anime });
    } catch (error) {
        console.error('Error in adminAnimeEditAction:', error);
        response.status(500).send('Internal Server Error');
    }
}


async function adminAnimeUpdateAction(request, response) {
    var animeId = request.params.animeId;
    var animeName = request.params.animeName;
    var animeData = {
        TitleEnglish: request.body.titleEnglish,
        TitleRomaji: request.body.titleRomaji || null,
        TitleNative: request.body.titleNative || null,
        Genre: request.body.genre,
        ReleaseDate: request.body.releaseDate,
        EndDate: request.body.endDate,
        AnimeStatus: request.body.animeStatus,
        Synopsis: request.body.synopsis || null,
        PopularityPosition: null,
        CoverImageURL: request.body.coverImageURL,
        BackgroundImageURL: request.body.backgroundImageURL,
        StreamingPlatformURL: request.body.streamingPlatformURL || null,
        AnimeFormat: "Anime",
        EpisodeDuration: parseInt(request.body.episodeDuration) || null,
        EpisodeCount: parseInt(request.body.episodeCount) || null,
        Chapters: parseInt(request.body.chapters) || null,
        Volumes: parseInt(request.body.volumes) || null
    };

    console.log(animeData);

    try {
        var numRows = await animeRepo.editOneAnime(animeId, animeData);
        response.redirect( "/admin/animes");
    } catch (error) {
        console.error('Error:', error);
        response.status(500).send("Internal Server Error");
    }
}

async function adminAnimeDelAction(request, response) {
    var animeId = request.params.animeId;
    var animeName = request.params.animeName;

    try {
        await animeRepo.delOneAnime(animeId);
    } catch (error) {
        response.redirect("/admin/animes");
    }
}


async function adminAnimeAddAction(request, response) {
    response.render("admin/admin_add_anime", { /* Additional data if needed */ });
}

async function adminAnimeCreateAction(request, response) {
    var animeData = {
        TitleEnglish: request.body.titleEnglish,
        TitleRomaji: request.body.titleRomaji || null,
        TitleNative: request.body.titleNative || null,
        Genre: request.body.genre,
        ReleaseDate: request.body.releaseDate,
        EndDate: request.body.endDate || "0000-00-00",
        AnimeStatus: request.body.animeStatus,
        Synopsis: request.body.synopsis || null,
        PopularityPosition: null,
        CoverImageURL: request.body.coverImageURL,
        BackgroundImageURL: request.body.backgroundImageURL,
        StreamingPlatformURL: request.body.streamingPlatformURL || null,
        AnimeFormat: "Anime",
        EpisodeDuration: parseInt(request.body.episodeDuration) || null,
        EpisodeCount: parseInt(request.body.episodeCount) || null,
        Chapters: parseInt(request.body.chapters) || null,
        Volumes: parseInt(request.body.volumes) || null
    };
    var animeId = await animeRepo.addOneAnime(animeData);
    if (animeId == null) {
        response.send(`
          <script>
            alert('This Anime already exists in the database.');
            window.location.href = '/admin/animes';
          </script>
        `);
        return response.end(); 
    }
    else{
        response.redirect("/admin/animes");
    }
}

// Admin Manga routes
async function adminMangaListAction(request, response) {
    try {
        var mangaList = await animeRepo.getAllMangas();
        
        response.render("admin/admin_manga", { "mangaList": mangaList });
    } catch (error) {
        console.error('Error in adminMangaListAction:', error);
        response.status(500).send('Internal Server Error');
    }
}

async function adminMangaEditAction(request, response) {
    var mangaId = request.params.mangaId;
    var mangaName = request.params.animeName;

    try {
        // Fetch the anime data
        var manga = await animeRepo.getOneManga(mangaId);

        response.render("admin/admin_edit_manga", { "manga": manga });
    } catch (error) {
        console.error('Error in adminAnimeEditAction:', error);
        response.status(500).send('Internal Server Error');
    }
}


async function adminMangaUpdateAction(request, response) {
    var mangaId = request.params.mangaId;
    var mangaName = request.params.animeName;
    var mangaData = {
        TitleEnglish: request.body.titleEnglish,
        TitleRomaji: request.body.titleRomaji || null,
        TitleNative: request.body.titleNative || null,
        Genre: request.body.genre,
        ReleaseDate: request.body.releaseDate,
        EndDate: request.body.endDate,
        AnimeStatus: request.body.animeStatus,
        Synopsis: request.body.synopsis || null,
        PopularityPosition: null,
        CoverImageURL: request.body.coverImageURL,
        BackgroundImageURL: request.body.backgroundImageURL,
        StreamingPlatformURL: request.body.streamingPlatformURL || null,
        AnimeFormat: "Manga",
        EpisodeDuration: parseInt(request.body.episodeDuration) || null,
        EpisodeCount: parseInt(request.body.episodeCount) || null,
        Chapters: parseInt(request.body.chapters) || null,
        Volumes: parseInt(request.body.volumes) || null
    };

    try {
        var numRows = await animeRepo.editOneManga(mangaId, mangaData);
        response.redirect("/admin/mangas");
    } catch (error) {
        console.error('Error:', error);
        response.status(500).send("here Internal Server Error");
    }
}

async function adminMangaDelAction(request, response) {
    var mangaId = request.params.mangaId;

    var mangaName = request.params.animeName;

    try {
   
        await animeRepo.delOneAnime(mangaId);
 
        response.redirect("/admin/mangas");
    } catch (error) {
        response.redirect("/admin/mangas");
    }
}

async function adminMangaAddAction(request, response) {
    response.render("admin/admin_add_manga", { /* Additional data if needed */ });
}

async function adminMangaCreateAction(request, response) {
    var mangaData = {
        TitleEnglish: request.body.titleEnglish,
        TitleRomaji: request.body.titleRomaji || null,
        TitleNative: request.body.titleNative || null,
        Genre: request.body.genre,
        ReleaseDate: request.body.releaseDate,
        EndDate: request.body.endDate || "0000-00-00",
        AnimeStatus: request.body.mangaStatus,
        Synopsis: request.body.synopsis || null,
        PopularityPosition: null,
        CoverImageURL: request.body.coverImageURL,
        BackgroundImageURL: request.body.backgroundImageURL,
        StreamingPlatformURL: request.body.streamingPlatformURL || null,
        AnimeFormat: "Manga",
        EpisodeDuration: parseInt(request.body.episodeDuration) || null,
        EpisodeCount: parseInt(request.body.episodeCount) || null,
        Chapters: parseInt(request.body.chapters) || null,
        Volumes: parseInt(request.body.volumes) || null
    };
    var mangaId = await animeRepo.addOneAnime(mangaData);
    if (mangaId == null) {
        response.send(`
          <script>
            alert('This Manga already exists in the database.');
            window.location.href = '/admin/mangas';
          </script>
        `);
        return response.end();
    }
    else{
        response.redirect("/admin/mangas");
    }
}

// Admin Quote routes
async function adminQuoteListAction(request, response) {
    try {
        var quoteList = await quoteRepo.getAllQuotes();
        
        response.render("admin/admin_quote", { "quoteList": quoteList });
    } catch (error) {
        console.error('Error in adminQuoteListAction:', error);
        response.status(500).send('Internal Server Error');
    }
}

async function adminQuoteEditAction(request, response) {
    var quoteId = request.params.quoteId;

    try {
        // Fetch the anime data
        var quote = await quoteRepo.getOneQuote(quoteId);

        response.render("admin/admin_edit_quote", { "quote": quote });
    } catch (error) {
        console.error('Error in adminQuoteEditAction:', error);
        response.status(500).send('Internal Server Error');
    }
}

async function adminQuoteUpdateAction(request, response) {
    var quoteId = request.params.quoteId;
    var quoteText = request.params.quoteText;
    var quoteData = {
        QuoteText: request.body.quoteText,
    };


    try {
        var numRows = await quoteRepo.editOneQuote(quoteId, quoteData);
        response.redirect("/admin/quotes");
    } catch (error) {
        console.error('Error:', error);
        response.status(500).send("here Internal Server Error");
    }
}


async function adminQuoteDelAction(request, response) {
    var quoteId = request.params.quoteId;

    try {
   
        await quoteRepo.delOneQuote(quoteId);
 
        response.redirect("/admin/quotes");
    } catch (error) {
        response.redirect("/admin/quotes");
    }
}

async function adminQuoteAddAction(request, response) {
    response.render("admin/admin_add_quote", { /* Additional data if needed */ });
}

async function adminQuoteCreateAction(request, response) {
        var quoteData = {
            QuoteText: request.body.quoteText,
        };
        // Check if the anime exists in the database
        const animeTitle = request.body.animeTitle;
        const animeID = await animeRepo.getAnimeIdByName(animeTitle);
        if (animeID==null) {

            response.send(`
          <script>
            alert('The anime does not exist in the database. Add the anime first before entering the quote.');
            window.location.href = '/admin/quotes';
          </script>
        `);
        return response.end();
        }

        // Check if the character exists in the database
        const characterName = request.body.characterName;
        const characterID = await characterRepo.getCharacterIdByName(characterName);
        if (characterID==null) {
            // Character not found
            response.send(`
          <script>
            alert('The character does not exist in the database. Add the character first before entering the quote.');
            window.location.href = '/admin/quotes';
          </script>
        `);
        return response.end();

        }

        // Both anime and character exist in the database, add the quote
        quoteData.CharacterID = characterID;
        quoteData.AnimeID = animeID;
        var quoteId = await quoteRepo.addOneQuote(quoteData);
        if (quoteId == null) {
            response.send(`
              <script>
                alert('This Quote already exists in the database.');
                window.location.href = '/admin/quotes';
              </script>
            `);
            return response.end(); 
        }
        else{
            response.redirect("/admin/quotes");
        }

}



// Admin Character routes
async function adminCharacterListAction(request, response) {
    try {
        var characterList = await characterRepo.getAllCharacters();
        
        response.render("admin/admin_character", { "characterList": characterList });
    } catch (error) {
        console.error('Error in adminCharacterListAction:', error);
        response.status(500).send('Internal Server Error');
    }
}

async function adminCharacterEditAction(request, response) {
    var characterId = request.params.characterId;
    var charName = request.params.charName;

    try {
        // Fetch the character data
        var character = await characterRepo.getOneCharacter(characterId);

        response.render("admin/admin_edit_character", { "character": character });
    } catch (error) {
        console.error('Error in adminCharacterEditAction:', error);
        response.status(500).send('Internal Server Error');
    }
}

async function adminCharacterUpdateAction(request, response) {
    var characterId = request.params.characterId;
    var charName = request.params.charName;
    var characterData = {
        CharName: request.body.charName,
        Birthday: request.body.titleRomaji || null,
        Age: request.body.charAge || null,
        Gender: request.body.charGender || null,
        BloodType: request.body.charBloodtype || null,
        Height: request.body.charHeight || null,
        CharSynopsis: request.body.CharSynopsis,
        ImageURL: request.body.charImageUrl,
        // Check if the checkbox is selected, set isMainCharacter to true, otherwise false
        isMainCharacter: request.body.isMainCharacter === 'on',
        Family: request.body.family || null,
        NamesGiven: request.body.charNames || null,
        HiddenSurnames: request.body.charHiddenNames || null,
        SpecificField1: request.body.charMoreInfo || null
    };

    try {
        var numRows = await characterRepo.editOneCharacter(characterId, characterData);
        response.redirect("/admin/characters");
    } catch (error) {
        console.error('Error:', error);
        response.status(500).send("here Internal Server Error");
    }
}

async function adminCharacterDelAction(request, response) {
    var characterId = request.params.characterId;
    var numRows = await characterRepo.delOneCharacter(characterId);
    response.redirect("/admin/characters");
}

async function adminCharacterDelAction(request, response) {
    var characterId = request.params.characterId;
    var charName = request.params.charName;

    try {
        await characterRepo.delOneCharacter(characterId);
        response.redirect("/admin/characters");
    } catch (error) {
        response.redirect("/admin/characters");
    }
}

async function adminCharacterAddAction(request, response) {
    response.render("admin/admin_add_character", { /* Additional data if needed */ });
}

async function adminCharacterCreateAction(request, response) {
    var characterData = { 
        CharName: request.body.charName,
        Birthday: request.body.titleRomaji || null,
        Age: request.body.charAge || null,
        Gender: request.body.charGender || null,
        BloodType: request.body.charBloodtype || null,
        Height: request.body.charHeight || null,
        CharSynopsis: request.body.CharSynopsis,
        ImageURL: request.body.charImageUrl,
        // Check if the checkbox is selected, set isMainCharacter to true, otherwise false
        isMainCharacter: request.body.isMainCharacter === 'on',
        Family: request.body.family || null,
        NamesGiven: request.body.charNames || null,
        HiddenSurnames: request.body.charHiddenNames || null,
        SpecificField1: request.body.charMoreInfo || null
     };
    var characterId = await characterRepo.addOneCharacter(characterData);
    if (characterId == null) {
        response.send(`
          <script>
            alert('This Character already exists in the database.');
            window.location.href = '/admin/characters';
          </script>
        `);
        return response.end(); 
    }
    else{
        response.redirect("/admin/characters");
    }
}


module.exports = router;
