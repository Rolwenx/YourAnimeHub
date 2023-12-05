// controllers/hello.route.js
const express = require('express');
const router = express.Router();
const auth = require("../utils/users.auth");
const userRepo = require('../utils/users.repository');
const { checkGuestAuthentication } = require('../utils/users.auth');



router.use('/login', checkGuestAuthentication);
router.use('/signup', checkGuestAuthentication);

router.get('/login', (req, res) => {
    res.render('authentification_login', { user: req.user });
});


router.get('/terms', (req, res) => {
    res.render('terms_conditions', { user: req.user });
});


// Authentication routes
router.get('/auth', (req, res) => {
    if (req.isAuthenticated()) {
      if (req.user.UserRole === "Admin") {
        return res.redirect("/admin");
      } 
      if (req.user.UserRole === "User") {
        // Redirect to the user's profile page (or home page)
        return res.redirect("/user"); 
      }
      if (req.user.UserRole === "Guest") {
        // Redirect to the user's profile page (or home page)
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
    console.log(request.body.username);
    console.log(request.body.userPassword);
    const areValid = await userRepo.areValidCredentials(request.body.username, request.body.userPassword);
    console.log("Back to loginPostAction");
    console.log(areValid);
    if (areValid) {
      const user = await userRepo.getOneUser(request.body.username);

      console.log(user);
      // Manually log in the user
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
      response.send(`
          <script>
            alert('Invalid credentials provided');
            window.location.href = '/login';
          </script>
        `);
        return response.end(); 
  }
  }


  async function SignUpHomeAction(req, res){
    res.render("authentification_signup", { user: req.user });

  }
  
  async function SignUpPostAction(request, res) {
    try {

        var UserData = {
            Username: request.body.username,
            Email: request.body.email,
            UserPassword: request.body.userPassword,
            UserRole: "User",
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