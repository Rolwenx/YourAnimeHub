// users.js

const passport = require("passport");
const usersRepo = require("../utils/users.repository.js");

const roleHierarchy = {
  'Admin': 2,
  'User': 1,
  'Guest': 0,
};

function checkRoleHierarchy(userRole, requiredRole) {
  // Check if the user role is equal to or higher than the required role
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}

module.exports = {

  // n initializes Passport.js for authentication in the provided Express 
  initialization(app) {
    app.use(passport.initialize());
    app.use(passport.session());
    passport.serializeUser(function (user, done) {
      done(null, user.Username);
    });
    passport.deserializeUser(async function (username, done) {
      let user = await usersRepo.getOneUser(username);
      done(null, user);
    });
  },

  checkRoleHierarchy,

  checkAdminAuthentication(request, response, next) {
    // Middleware to check if the user is authenticated and has the "Admin" role
    if (request.isAuthenticated() && checkRoleHierarchy(request.user.UserRole, "Admin")) {
      return next();
    } else {
      // Redirect unauthorized users to the 404 error page
      return response.redirect("/404");
    }
  },

  checkUserAuthentication(request, response, next) {
    // Middleware to check if the user is authenticated and has the "User" role
    if (request.isAuthenticated() && checkRoleHierarchy(request.user.UserRole, "User")) {
      return next();
    } else {
      // Redirect unauthorized users to the 404 error page
      return response.redirect("/404");
    }
  },


  checkGuestAuthentication(request, response, next) {
    // Middleware to check if the user is unauthenticated (guest)
    if (!request.isAuthenticated()) {
      // User is not authenticated, allow access to the route
      return next();
    } else {
      // Redirect authenticated users to a different page, for example, the home page "/"
      return response.redirect("/404");
    }
  }
};
