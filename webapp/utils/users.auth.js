const passport = require("passport");
const usersRepo = require("../utils/users.repository.js");

module.exports = {
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
        return response.redirect("/auth");
      }
    };
  },
  
   checkRoleHierarchy(userRole, requiredRole) {
    const roleHierarchy = {
      'admin': 2,
      'user': 1,
      'guest': 0,
    };
  
    // Check if the user role is equal to or higher than the required role
    return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
  }
  
};