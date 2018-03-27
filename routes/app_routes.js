/**
 * Route handling for pages within the app
 */
var express = require('express');
var router = express.Router();
let path = require('path');

//middleware for the router

router.get('/', function (req, res) {
    //authentication
    if (req.session && req.session.user) {
        res.render('resapp');
    } else {
        res.redirect('/login');
    }
});

router.get('/settings', function (req, res) {
    //authentication
    if (req.session && req.session.user) {
        res.render('settings');
    } else {
        res.redirect('/login');
    }
});

router.get('/accounts', function (req, res) {
    //authentication
    if (req.session && req.session.user) {
        //must be admin to add/delete accounts
        if (req.session.user.role == "Admin") {
            res.render('accounts');
        } else {
            res.redirect('/resapp/home');
        }
    } else {
        res.redirect('/login');
    }

});

router.get('/home', function (req, res) {
    //authentication
    if (req.session && req.session.user) {
        res.render('resapp');
    }
});

router.get('/phonebook', function (req, res) {
    //authentication
    if (req.session && req.session.user) {
        res.render('phonebook');
    } else {
        res.redirect('/login');
    }
});

router.get('/roster', function (req, res) {
    //authentication
    if (req.session && req.session.user) {
        //must be admin to change roster
        if (req.session.user.role == "Admin") {
            res.render('roster');
        } else {
            res.redirect('/resapp/home');
        }
    } else {
        res.redirect('/login');
    }
});
router.get('/calendar', function (req, res) {
    //authentication
    if (req.session && req.session.user) {
        res.render('calendar');
    } else {
        res.redirect('/login');
    }
});
router.get('/inopen', function (req, res) {
    //authentication
    if (req.session && req.session.user) {
        res.render('inopen', { email: req.session.user.email });
    } else {
        res.redirect('/login');
    }
});
router.get('/emergency', function (req, res) {
    //authentication
    if (req.session && req.session.user) {
        res.render('emergency');
    } else {
        res.redirect('/login');
    }
});

module.exports = router;