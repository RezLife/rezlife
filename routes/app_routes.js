/**
 * Route handling for pages within the app
 */
var express = require('express');
var router = express.Router();
let path = require('path');

//middleware for the router
router.use('/', express.static(path.join(__dirname, '../public')));

router.get('/', function (req, res) {
    res.render('resapp');
});

router.get('/settings', function (req, res) {
    res.render('settings');
});

router.get('/accounts', function (req, res) {
    res.render('accounts');
//     //safe version
// /*if (req.session && req.session.user) {
//     res.sendFile(path.join(publicPath, 'views/webapp', 'accounts.html'));
// } else {
//     res.redirect('/login');
// }*/
});

router.get('/home', function (req, res) {
    res.render('resapp');
});

router.get('/phonebook', function (req, res) {
    res.render('phonebook');
});

router.get('/roster', function (req, res) {
    res.render('roster');
});
router.get('/calendar', function (req, res) {
    res.render('calendar');
});
router.get('/inopen', function (req, res) {
    res.render('inopen');
});
router.get('/emergency', function (req, res) {
    res.render('emergency');
});

module.exports = router;