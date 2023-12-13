// controllers/hello.route.js
const express = require('express');
const router = express.Router();
const { checkUserAuthentication } = require('../utils/users.auth');
const userRepo = require('../utils/users.repository');
const reviewRepo = require('../utils/review.repository');
const animeRepo = require('../utils/anime.repository');

router.use('/', checkUserAuthentication);



router.get('/', UserHomeAction);


async function UserHomeAction(request,response){

    try {
        const userId = request.user ? request.user.UserID : null;

        const StatsCount = {};
        const reviews = await reviewRepo.getAllReviewsOfUser(userId);
        StatsCount.ReviewCount = reviews.length;
        const anime = await animeRepo.getAllAnimeWatchedByUser(userId,'set-complete','Anime');
        const manga = await animeRepo.getAllAnimeWatchedByUser(userId,'set-complete','Manga');
        StatsCount.AnimeCount = anime.length;
        StatsCount.MangaCount = manga.length;

        var WatchingAnimeList = await userRepo.getAllAnimeForWatchlist(userId,'set-watching','Anime');
        var WatchingMangaList = await userRepo.getAllAnimeForWatchlist(userId,'set-reading','Manga');
       

        response.render('user/user', {WatchingMangaList,WatchingAnimeList, "StatsCount":StatsCount, user: request.user, title: 'Profile - YourAnimeHub',activePage:'profile' });
    } catch (error) {
        console.error('Error:', error);
        response.status(500).send(" UserHomeAction Internal Server Error");
    }
}



router.get('/watchlist/anime', UserAnimeWatchlistAction);
router.get('/watchlist/anime/complete', UserAnimeCompleteWatchlistAction);
router.get('/watchlist/anime/watching', UserAnimeWatchingWatchlistAction);
router.get('/watchlist/anime/planning', UserAnimePlanningWatchlistAction);



async function UserAnimeWatchlistAction(request, response) {
    var userId = request.user.UserID;

    try {
        var CompleteAnimeList = await userRepo.getAllAnimeForWatchlist(userId,'set-complete','Anime');
        var PlanningAnimeList = await userRepo.getAllAnimeForWatchlist(userId,'set-planning','Anime');
        var WatchingAnimeList = await userRepo.getAllAnimeForWatchlist(userId,'set-watching','Anime');
        var DroppedAnimeList = await userRepo.getAllAnimeForWatchlist(userId,'set-dropped','Anime');
        var PausedAnimeList = await userRepo.getAllAnimeForWatchlist(userId,'set-paused','Anime');
        var RewatchedAnimeList = await userRepo.getAllAnimeForWatchlist(userId,'set-rewatching','Anime');
        console.log(RewatchedAnimeList);

        
        response.render("user/user_watchlist_anime", {
        "WatchingAnimeList":WatchingAnimeList,
        "RewatchedAnimeList":RewatchedAnimeList,
        "PausedAnimeList":PausedAnimeList,
        "DroppedAnimeList":DroppedAnimeList,
        "CompleteAnimeList": CompleteAnimeList,
        "PlanningAnimeList":PlanningAnimeList,
         user: request.user, title: 'Profile - YourAnimeHub', activePage: 'your_list'  });
    } catch (error) {
        console.error('Error in UserAnimeCompleteWatchlistAction:', error);
        response.status(500).send('Internal Server Error');
    }
}

async function UserAnimeCompleteWatchlistAction(request, response) {
    var userId = request.user.UserID;

    try {
        var CompleteAnimeList = await userRepo.getAllAnimeForWatchlist(userId,'set-complete','Anime');


        response.render("user/user_watchlist_anime_complete", {"CompleteAnimeList": CompleteAnimeList, user: request.user, title: 'Profile - YourAnimeHub', activePage: 'your_list'  });
    } catch (error) {
        console.error('Error in UserAnimeCompleteWatchlistAction:', error);
        response.status(500).send('Internal Server Error');
    }
}

async function UserAnimeWatchingWatchlistAction(request, response) {
    var userId = request.user.UserID;

    try {
        var WatchingAnimeList = await userRepo.getAllAnimeForWatchlist(userId,'set-watching','Anime');


        response.render("user/user_watchlist_anime_watching", {"WatchingAnimeList": WatchingAnimeList, user: request.user, title: 'Profile - YourAnimeHub', activePage: 'your_list'  });
    } catch (error) {
        console.error('Error in UserAnimeWatchingWatchlistAction:', error);
        response.status(500).send('Internal Server Error');
    }
}



async function UserAnimePlanningWatchlistAction(request, response) {
    var userId = request.user.UserID;

    try {
        var PlanningAnimeList = await userRepo.getAllAnimeForWatchlist(userId,'set-planning','Anime');


        response.render("user/user_watchlist_anime_planning", {"PlanningAnimeList": PlanningAnimeList, user: request.user, title: 'Profile - YourAnimeHub', activePage: 'your_list'  });
    } catch (error) {
        console.error('Error in UserAnimeWatchingWatchlistAction:', error);
        response.status(500).send('Internal Server Error');
    }
}

router.get('/watchlist/manga', UserMangaWatchlistAction);
router.get('/watchlist/manga/complete', UserMangaCompleteWatchlistAction);
router.get('/watchlist/manga/reading', UserMangaReadingWatchlistAction);
router.get('/watchlist/manga/planning', UserMangaPlanningWatchlistAction);



async function UserMangaWatchlistAction(request, response) {
    var userId = request.user.UserID;

    try {
        var CompleteMangaList = await userRepo.getAllAnimeForWatchlist(userId,'set-complete','Manga');
        var PlanningMangaList = await userRepo.getAllAnimeForWatchlist(userId,'set-planning','Manga');
        var ReadingMangaList = await userRepo.getAllAnimeForWatchlist(userId,'set-reading','Manga');

        
        response.render("user/user_watchlist_manga", {"ReadingMangaList":ReadingMangaList,
        "CompleteMangaList": CompleteMangaList,
        "PlanningMangaList":PlanningMangaList,
         user: request.user, title: 'Profile - YourAnimeHub', activePage: 'your_list'  });
    } catch (error) {
        console.error('Error in UserMangaWatchlistAction:', error);
        response.status(500).send('Internal Server Error');
    }
}

async function UserMangaCompleteWatchlistAction(request, response) {
    var userId = request.user.UserID;

    try {
        var CompleteMangaList = await userRepo.getAllAnimeForWatchlist(userId,'set-complete','Manga');



        response.render("user/user_watchlist_manga_complete", {"CompleteMangaList": CompleteMangaList, user: request.user, title: 'Profile - YourAnimeHub', activePage: 'your_list'  });
    } catch (error) {
        console.error('Error in UserMangaCompleteWatchlistAction:', error);
        response.status(500).send('Internal Server Error');
    }
}

async function UserMangaReadingWatchlistAction(request, response) {
    var userId = request.user.UserID;

    try {
        var ReadingMangaList = await userRepo.getAllAnimeForWatchlist(userId,'set-reading','Manga');


        response.render("user/user_watchlist_manga_reading", {"ReadingMangaList": ReadingMangaList, user: request.user, title: 'Profile - YourAnimeHub', activePage: 'your_list'  });
    } catch (error) {
        console.error('Error in UserMangaReadingWatchlistAction:', error);
        response.status(500).send('Internal Server Error');
    }
}



async function UserMangaPlanningWatchlistAction(request, response) {
    var userId = request.user.UserID;

    try {
        var PlanningMangaList = await userRepo.getAllAnimeForWatchlist(userId,'set-planning','Manga');
        console.log(PlanningMangaList);


        response.render("user/user_watchlist_manga_planning", {"PlanningMangaList": PlanningMangaList, user: request.user, title: 'Profile - YourAnimeHub', activePage: 'your_list'  });
    } catch (error) {
        console.error('Error in UserMangaPlanningWatchlistAction:', error);
        response.status(500).send('Internal Server Error');
    }
}


router.get('/settings', UserEditAction);
router.post('/settings/update/profile', UserUpdateProfileAction);
router.post('/settings/update/personal_details', UserUpdatePersonalAction);
router.post('/settings/update/password', UserUpdatePasswordAction);


async function UserEditAction(request, response) {
    var userId = request.user.UserID;

    try {
        // Fetch the user data
        var fetched_user = await userRepo.getOneUserByID(userId);

        response.render("user/user_settings", { "fetched_user": fetched_user,  user: request.user,activePage: 'profile' });
    } catch (error) {
        console.error('Error in UserEditAction:', error);
        response.status(500).send('Internal Server Error');
    }
}


async function UserUpdateProfileAction(request, response) {
    var userId = request.user.UserID;
    var userName = request.user.Username;
    var userData = {
        ProfilePictureURL: request.body.profile_pic,
        TitleDisplayLanguage: request.body.titleDisplay || null,
        Bio: request.body.bio || null,
    };

    try {
        var numRows = await userRepo.editOneUser(userId, userData);

        response.redirect("/user/settings");
    } catch (error) {
        console.error('Error:', error);
        response.status(500).send(" UserUpdateProfileAction Internal Server Error");
    }
}


async function UserUpdatePersonalAction(request, response) {
    var userId = request.user.UserID;
    var userData = {
        Username: request.body.username,
        Email: request.body.email,
        Birthday: request.body.birthday,
    };

    try {
        var numRows = await userRepo.editOneUser(userId, userData);

        response.redirect("/user/settings");
    } catch (error) {
        console.error('Error:', error);
        response.status(500).send(" UserUpdatePersonalAction Internal Server Error");
    }
}


async function UserUpdatePasswordAction(request, response) {
    var userId = request.user.UserID;
    var userData = {
        UserPassword: request.body.userPassword,
    };

    try {
        await userRepo.updatePassword(userId,userData.UserPassword);

        response.redirect("/user/settings");
    } catch (error) {
        console.error('Error:', error);
        response.status(500).send(" UserUpdatePersonalAction Internal Server Error");
    }
}

router.get('/reviews', UserReviewsAction);

async function UserReviewsAction(request,response){
    try {
        const userId = request.user ? request.user.UserID : null;
        const UserReviewList = await reviewRepo.getAllReviewsOfUser(userId);

        response.render('user/user_reviews', { UserReviewList, user: request.user,  activePage: 'profile' });
    } catch (error) {
        console.error('Error:', error);
        response.status(500).send(" UserReviewsAction Internal Server Error");
    }
}

//http://localhost:9000/user/favourites
router.get('/favourites', (req, res) => {
    res.render('user/user_favourites', { user: req.user,  activePage: 'profile' });
});

module.exports = router;