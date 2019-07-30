var express = require('express');

/* Authentication Routes */

module.exports = function(passport) {
    var router = express.Router();

    router.get('/login', function(req, res, next) {
      res.render('login.html', { title: 'Login' });
    });

    router.get('/logout', function(req, res, next) {
        req.session.destroy();
        req.logout();
        return res.redirect('/');
    });

    router.post('/login', function(req, res, next) {
        passport.authenticate('ldapauth', {session: false}, function(err, user, info) {
            // Error while trying to authenticate
            if (err) {
                return next(err); // will generate a 500 error
            }

            // Authentication Failed, redirect to login
            if (! user) {
                return res.redirect('/login');
            }

            req.logIn(user, function(err) {
                if (err) {
                    return next(err);
                }

                // Map sAMAccountName to uid variable since everything references uid
                if (!('uid' in req.user)) {
                  console.log('Mapping sAMAccountName to uid');
                  req.user.uid = req.user.sAMAccountName;
                }

                // Authentication success, redirect to dashboard
                return res.redirect('/');
            });

        })(req, res, next);
    });

    return router;
}
