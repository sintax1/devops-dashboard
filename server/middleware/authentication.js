'use strict';

// Authentication
var authentication = {
    isAuthenticated: function(req, res, next) {

        // Already logged in
        if (req.isAuthenticated()) {
            return next();
        };

        // Not logged in, redirect to login page
        res.redirect('/login');
    }
};

module.exports = authentication;
