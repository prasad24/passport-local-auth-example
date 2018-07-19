const router = require('express').Router();
const AppName = require('../config').AppName;

router.get('/profile', (req, res) => {
    if(!req.user) {
        res.redirect("/");
    }
    const name = req.user.name;

    res.render('profile', {
        name,
        AppName
    });
});

module.exports = router;
