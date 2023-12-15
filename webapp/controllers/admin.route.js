// Admin route.js
const express = require('express');
const router = express.Router();
const animeRepo = require('../utils/anime.repository');
const quoteRepo = require('../utils/quote.repository'); 
const characterRepo = require('../utils/characters.repository');
const userRepo = require('../utils/users.repository');
const { checkAdminAuthentication } = require('../utils/users.auth');


// Admin routes
//all routes starting with "/admin" will go through this middleware.
router.use('/admin', checkAdminAuthentication);


router.get('/admin', adminHomeAction);
router.get('/admin/animes', adminAnimeListAction);
router.get('/admin/mangas', adminMangaListAction);
router.get('/admin/quotes', adminQuoteListAction);
router.get('/admin/characters', adminCharacterListAction);
router.get('/admin/users', adminUserListAction);

router.get('/admin/users/edit/:userId/:userName', adminUserEditAction);
router.post('/admin/users/update/:userId/:userName', adminUserUpdateAction);

router.post('/admin/users/delete/:userId/:userName', adminUserDelAction);

async function adminUserDelAction(request, response) {
    var userId = request.params.userId;
    var userName = request.params.userName;


    try {
        has_anime_been_deleted = await userRepo.delOneUser(userId);

        response.redirect("/admin/users");
    } catch (error) {
        response.redirect("/admin/users");
    }
}



router.get('/admin/animes/edit/:animeId/:animeName', adminAnimeEditAction);
router.post('/admin/animes/update/:animeId/:animeName', adminAnimeUpdateAction);
router.post('/admin/animes/delete/:animeId/:animeName', adminAnimeDelAction);

router.get('/admin/mangas/edit/:mangaId/:mangaName', adminMangaEditAction);
router.post('/admin/mangas/update/:mangaId/:mangaName', adminMangaUpdateAction);
router.post('/admin/mangas/delete/:mangaId/:mangaName', adminMangaDelAction);

router.get('/admin/quotes/edit/:quoteId', adminQuoteEditAction);
router.post('/admin/quotes/update/:quoteId', adminQuoteUpdateAction);
router.post('/admin/quotes/delete/:quoteId', adminQuoteDelAction);

router.get('/admin/quotes/quote_of_the_day', adminQuoteDailyAction);

router.get('/admin/characters/edit/:characterId/:characterName', adminCharacterEditAction);
router.post('/admin/characters/update/:characterId/:characterName', adminCharacterUpdateAction);
router.post('/admin/characters/delete/:characterId/:characterName', adminCharacterDelAction);

router.get('/admin/animes/add', adminAnimeAddAction);
router.post('/admin/animes/create',adminAnimeCreateAction);


router.get('/admin/mangas/add', adminMangaAddAction);
router.post('/admin/mangas/create', adminMangaCreateAction);

router.get('/admin/quotes/add', adminQuoteAddAction);
router.post('/admin/quotes/create', adminQuoteCreateAction);

router.get('/admin/characters/add', adminCharacterAddAction);
router.post('/admin/characters/create', adminCharacterCreateAction);

router.get('/admin/users/add', adminUserAddAction);
router.post('/admin/users/create', adminUserCreateAction);

// Admin Home route
async function adminHomeAction(request, res) {
    try {

    
        // We fetch the list of anime in database
        const animeList = await animeRepo.getAllAnime();
        const mangaList = await animeRepo.getAllMangas(); 
        const quoteList = await quoteRepo.getAllQuotes();
        const characterList = await characterRepo.getAllCharacters();
        const userList = await userRepo.getAllUsers();

        // We feth the number of anime in database
        const animeCount = animeList.length;
        const userCount = userList.length;
        MangaCount = mangaList.length;
        const quoteCount = quoteList.length;
        const characterCount = characterList.length;

        res.render('admin/admin', {
            animeCount,
            MangaCount,
            quoteCount,
            userCount,
            characterCount,
            animeList,
            characterList,
            mangaList,
            quoteList, 
            userList,
            user: request.user,
            activePage: 'admin',
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
        
        response.render("admin/admin_anime", { "animeList": animeList,  user: request.user});
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

        response.render("admin/admin_edit_anime", { "anime": anime,  user: request.user,activePage: 'admin' });
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
        CoverImageURL: request.body.coverImageURL,
        BackgroundImageURL: request.body.backgroundImageURL,
        StreamingPlatformURL: request.body.streamingPlatformURL || null,
        AnimeFormat: "Anime",
        TypeFormat: request.body.typeFormat,
        EpisodeDuration: parseInt(request.body.episodeDuration) || null,
        EpisodeCount: parseInt(request.body.episodeCount) || null,
        Chapters: parseInt(request.body.chapters) || null,
        Volumes: parseInt(request.body.volumes) || null
    };



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
        has_anime_been_deleted = await animeRepo.delOneAnime(animeId);

        response.redirect("/admin/animes");
    } catch (error) {
        response.redirect("/admin/animes");
    }
}


async function adminAnimeAddAction(request, response) {
    response.render("admin/admin_add_anime", {  user: request.user, activePage: 'admin' });
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
        CoverImageURL: request.body.coverImageURL,
        BackgroundImageURL: request.body.backgroundImageURL,
        StreamingPlatformURL: request.body.streamingPlatformURL || null,
        AnimeFormat: "Anime",
        TypeFormat: request.body.typeFormat,
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
        
        response.render("admin/admin_manga", { "mangaList": mangaList,  user: request.user });
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

        response.render("admin/admin_edit_manga", { "manga": manga,  user: request.user,activePage: 'admin' });
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
        CoverImageURL: request.body.coverImageURL,
        BackgroundImageURL: request.body.backgroundImageURL,
        StreamingPlatformURL: request.body.streamingPlatformURL || null,
        AnimeFormat: "Manga",
        TypeFormat: request.body.typeFormat,
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
   
        has_been_deleted = await animeRepo.delOneAnime(mangaId);
 
        response.redirect("/admin/mangas");
    } catch (error) {
        response.redirect("/admin/mangas");
    }
}

async function adminMangaAddAction(request, response) {
    response.render("admin/admin_add_manga", {  user: request.user, activePage: 'admin' });
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
        CoverImageURL: request.body.coverImageURL,
        BackgroundImageURL: request.body.backgroundImageURL,
        StreamingPlatformURL: request.body.streamingPlatformURL || null,
        AnimeFormat: "Manga",
        TypeFormat: request.body.typeFormat,
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
        
        response.render("admin/admin_quote", { "quoteList": quoteList,  user: request.user });
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

        response.render("admin/admin_edit_quote", { "quote": quote,  user: request.user,activePage: 'admin' });
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
    response.render("admin/admin_add_quote", {  user: request.user,activePage: 'admin' });
}

async function adminQuoteCreateAction(request, response) {
        var quoteData = {
            QuoteText: request.body.quoteText,
            isQuoteOfDay: "False",
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


async function adminQuoteDailyAction(request, response) {
    try {
        quote_of_the_day = await quoteRepo.getQuoteOfTheDay();
        response.redirect("/admin");
    } catch (error) {
        console.error('Error in adminQuoteDailyAction:', error);
        response.status(500).send('Internal Server Error');
    }
}




// Admin Character routes
async function adminCharacterListAction(request, response) {
    try {
        var characterList = await characterRepo.getAllCharacters();
        
        response.render("admin/admin_character", { "characterList": characterList,  user: request.user });
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

        response.render("admin/admin_edit_character", { "character": character,  user: request.user,activePage: 'admin' });
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
        Birthday: request.body.charBirthday || null,
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
    response.render("admin/admin_add_character", {  user: request.user, activePage: 'admin' });
}

async function adminCharacterCreateAction(request, response) {
    var characterData = { 
        CharName: request.body.charName,
        Birthday: request.body.charBirthday || null,
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


async function adminUserListAction(request, response) {
    try {
        var userList = await userRepo.getAllUsers();
        
        response.render("admin/admin_user", { "userList": userList,  user: request.user});
    } catch (error) {
        console.error('Error in adminAnimeListAction:', error);
        response.status(500).send('Internal Server Error');
    }
}

async function adminUserAddAction(request, response) {
    response.render("admin/admin_add_user", {  user: request.user,activePage: 'admin' });
}

async function adminUserCreateAction(request, response) {
    var userData = { 
        Username: request.body.username,
        Email: request.body.email,
        FirstName: request.body.firstname || null,
        LastName: request.body.lastname || null,
        UserPassword: request.body.password,
        ProfilePictureURL: request.body.profilepictureurl || 'https://static.vecteezy.com/system/resources/previews/020/765/399/non_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg',
        UserRole: request.body.userole || null,
        Birthday: request.body.birthday || null,
        Bio: request.body.bio || null,
     };
    var userId = await userRepo.createUser(userData);
    if (userId == null) {
        response.send(`
          <script>
            alert('This User already exists in the database.');
            window.location.href = '/admin/users';
          </script>
        `);
        return response.end(); 
    }
    else{
        response.redirect("/admin/users");
    }
}


async function adminUserEditAction(request, response) {
    var userName = request.params.userName;

    try {
        // Fetch the user data
        var fetched_user = await userRepo.getOneUser(userName);
   

        response.render("admin/admin_edit_user", { "fetched_user": fetched_user,  user: request.user,activePage: 'admin' });
    } catch (error) {
        console.error('Error in adminUserEditAction:', error);
        response.status(500).send('Internal Server Error');
    }
}


async function adminUserUpdateAction(request, response) {
    var userId = request.params.userId;
    var userName = request.params.userName;
    var userData = {
        Username: request.body.username,
        Email: request.body.email,
        FirstName: request.body.firstname || null,
        LastName: request.body.lastname || null,
        ProfilePictureURL: request.body.profilepictureurl || 'https://static.vecteezy.com/system/resources/previews/020/765/399/non_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg',
        UserRole: request.body.userole || null,
        Birthday: request.body.birthday || null,
        Bio: request.body.bio || null,
    };


    try {
        var numRows = await userRepo.editOneUser(userId, userData);
        response.redirect("/admin/users");
    } catch (error) {
        console.error('Error:', error);
        response.status(500).send("here Internal Server Error");
    }
}


module.exports = router;

