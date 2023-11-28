// controllers/hello.route.js
const express = require('express');
const router = express.Router();
const auth = require("../utils/users.auth");
const userRepo = require("../utils/users.repository");

// http://localhost:9000/login
router.get('/login', (req, res) => {
    //res.send('Hello, from controller...');
    res.render('authentification_login', { favourites: [] });
});

// http://localhost:9000/terms
router.get('/terms', (req, res) => {
    //res.send('Hello, from controller...');
    res.render('terms_conditions', { favourites: [] });
});

// Authentication routes
router.get('/auth', (req, res) => {
    if (req.isAuthenticated()) {
      if (req.user.UserRole === "ADMIN") {
        return res.redirect("/auth/admin");
      } else {
        // Redirect to the user's profile page (or home page)
        return res.redirect("/user"); // Adjust the path as needed
      }
    } else {
      // User is not authenticated, redirect to the login page
      return res.redirect("/login"); // Adjust the path to your login page
    }
  })
router.get('/auth/user', auth.checkAuthentication("User"), userAction);
router.get('/auth/admin', auth.checkAuthentication("Admin"), userAction);
router.get('/auth/protected', protectedGetAction);

router.post('/login', loginPostAction);
router.get('/auth/logout', logoutAction);

router.get('/signup', SignUpHomeAction);
router.post('/signup/auth',SignUpPostAction);


async function userAction(request, response) {
    console.log("User Role:", request.user.UserRole); 
    let userData = await userRepo.getOneUser(request.user.Username);
    let userJson = JSON.stringify(userData);
    response.render('/', { "extraContent": userJson });
  }
  
  async function protectedGetAction(request, response) {
    console.log("User Role:", request.user.UserRole); // Log user role
    if (request.isAuthenticated()) {
      if (request.user.UserRole === "Admin") {
        response.redirect("/admin");
      } else {
        response.redirect("/");
      }
    } else {
      response.redirect("/");
    }
  }
  
  async function loginPostAction(request, response) {
    console.log(request.body.username);
    console.log(request.body.userPassword);
    const areValid = await userRepo.areValidCredentials(request.body.username, request.body.userPassword);
    console.log("Back to loginPostAction");
    console.log(areValid);
    if (areValid) {
      const user = await userRepo.getOneUser(request.body.username);

      // Manually log in the user
      request.logIn(user, function (err) {
          if (err) {
              console.log("ERROR");
              console.log(err);
              // return next(err); // <-- Remove this line
          }

          console.log("Logged In User Role:", request.user.UserRole);

          if (request.user.UserRole === "Admin") {
              return response.redirect("/auth/admin");
          } else {
              return response.redirect("/");
          }
      });
  } else {
      response.send("Invalid credentials provided");
  }
  }


  async function SignUpHomeAction(req, res){
    res.render("authentification_signup", { /* Additional data if needed */ });

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