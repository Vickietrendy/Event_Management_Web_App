const checkRole = (role) => {
    return (req, res, next) => {
      if (req.isAuthenticated() && req.user.role === role) {
        return next();
      } else {
        res.redirect('/about'); // Redirect unauthorized users to login page
      }
    };
  };
  
// Export the middleware functions
module.exports = {
    alumniOnly: checkRole('alumni'),
    alumniManagerOnly: checkRole('alumni_manager'),
    membersOnly: (req, res, next) => {
      if (req.isAuthenticated() && (req.user.role === 'alumni' || req.user.role === 'alumni_manager')) {
        return next();
      } else {
        res.redirect('/about'); // Redirect unauthorized users to login page
      }
    },
  };


  