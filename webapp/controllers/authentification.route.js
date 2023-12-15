// controllers/hello.route.js
const express = require('express');
const router = express.Router();
const auth = require("../utils/users.auth");
const userRepo = require('../utils/users.repository');
const { checkGuestAuthentication } = require('../utils/users.auth');



router.use('/login', checkGuestAuthentication);
router.use('/signup', checkGuestAuthentication);

router.get('/login', (req, res) => {
    res.render('authentification_login', { user: req.user, passwordNotMatch: false, usernameNotMatch:false, title: 'Login into YourAnimeHub', activePage: 'login' });
});


router.get('/terms', (req, res) => {
    res.render('terms_conditions', { user: req.user, activePage:'none' });
});


// Authentication routes
router.get('/auth', (req, res) => {
    if (req.isAuthenticated()) {
      if (req.user.UserRole === "Admin") {
        return res.redirect("/admin");
      } 
      if (req.user.UserRole === "User") {
        // Redirect to the user's profile page 
        return res.redirect("/user"); 
      }
      if (req.user.UserRole === "Guest") {
        // Redirect to the user's profile page 
        return res.redirect("/user"); 
      }
    } else {
      // User is not authenticated, redirect to the login page
      return res.redirect("/login"); 
    }
  })

router.get('/logout', logoutAction);

router.post('/login', loginPostAction);
router.get('/signup', SignUpHomeAction);
router.post('/signup/auth',SignUpPostAction);


async function loginPostAction(request, response) {
  const isUsernameValid = await userRepo.isUsernameValid(request.body.username);

  if (isUsernameValid) {
    const areValid = await userRepo.areValidCredentials(request.body.username, request.body.userPassword);

      if (areValid == "True") {
        const user = await userRepo.getOneUser(request.body.username);

        request.logIn(user, function (err) {
          if (err) {
            console.log("ERROR");
            console.log(err);
          }

          console.log("Logged In User Role:", request.user.UserRole);

          if (request.user.UserRole === "Admin") {
            return response.redirect("/");
          } else {
            return response.redirect("/");
          }
        });
    } else {
      response.render('authentification_login', { user: request.user, passwordNotMatch: true, usernameNotMatch: false, activePage:true, title: 'Login into YourAnimeHub'});
    }
  } else {
    // Username is not valid
    response.render('authentification_login', { user: request.user, passwordNotMatch: false, usernameNotMatch: true,activePage:true, title: 'Login into YourAnimeHub' });
  }
}



  async function SignUpHomeAction(req, res){
    res.render("authentification_signup", { user: req.user, title: 'Sign Up for YourAnimeHub', activePage: 'login' });

  }
  
  async function SignUpPostAction(request, res) {
    try {

        var UserData = {
            Username: request.body.username,
            Email: request.body.email,
            UserPassword: request.body.userPassword,
            UserRole: "User",
            ProfilePictureURL: request.body.profilepictureurl || 'https://static.vecteezy.com/system/resources/previews/020/765/399/non_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg',
        };

        var userID = await userRepo.createUser(UserData);
        if (userID == null) {
            res.send(`
              <script>
                alert('This Username/Email is already used.');
                window.location.href = '/signup';
              </script>
            `);
            return res.end(); 
        }
        else{
            res.redirect("/");
        }
    } catch (error) {
        console.error("Error during sign-up:", error);
        res.redirect('/error');
    }
  }
  


  function logoutAction(request, response) {
    console.log("Logged Out User Role:", request.user.UserRole); 
    request.logout(function(err) {
      if (err) { return next(err); }
      response.redirect('/');
    });
  }
module.exports = router;