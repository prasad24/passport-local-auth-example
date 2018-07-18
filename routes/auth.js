const router = require('express').Router();
const AppName = require('../config').AppName;
const User = require('../models/user');

router.get('/login', (req, res) => {
    res.render('login', {
        AppName
    });
});

router.post('/login', (req, res) => {
    const {username, password} = req.body;
    User.login(username, password, (err, user) => {
        if(user) {
            res.redirect('/profile');
        } else {
            res.redirect('/login');
        }
    }); 
});

router.get('/register', (req, res) => {
    res.render('register', {
        AppName
    });
});

router.post('/register', (req, res) => {
    const { name, email, username, password } = req.body;
    console.log(name, email, username, password);
    const user = new User({name, email, username, password});
    user.save(err => {
        if(err) {
            console.log('Error saving user', err);
        }
        res.redirect('/profile');
    });
});

router.get('/logout', (req, res) => {
    res.redirect('/');
});

module.exports = router;