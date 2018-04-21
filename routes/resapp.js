/**
 * Route handling for pages within the app
 */
var express = require('express');
var router = express.Router();
let path = require('path');
var setUser = require('../public/js/getUser');

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
        res.render('accounts');
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
        res.render('roster');
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
        var temp = req.session.user.email;
        setUser.setUser(temp, function() {
            res.render('inopen'); 
        });
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

//return user session when prompted
router.get('/user-session',function(req,res){
    //authentication
    if (req.session && req.session.user) {
        // console.log('req.session: ' + req.session);
        // console.log('req.session.user: ' + req.session.user);
        res.send(req.session);
    } else {
        res.redirect('/login');
    }
});
module.exports = router;