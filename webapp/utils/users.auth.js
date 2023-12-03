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

  checkAuthentication(role) {
    return function (request, response, next) {
      if (request.isAuthenticated()) {
        if (role) {
          if (checkRoleHierarchy(request.user.UserRole, role)) {
            return next();
          } else {
            return response.status(401).send("Unauthorized (insufficient role)");
          }
        } else { // No special role needed for the page -> next middleware
          return next();
        }
      } else {
        // Redirect unauthenticated users to the login page
        return response.redirect("/");
      }
    };
  },

  checkRoleHierarchy,

  checkAdminAuthentication(request, response, next) {
    // Middleware to check if the user is authenticated and has the "Admin" role
    if (request.isAuthenticated() && checkRoleHierarchy(request.user.UserRole, "Admin")) {
      return next();
    } else {
      // Redirect unauthorized users to the login page or another appropriate page
      return response.redirect("/");
    }
  },
};
