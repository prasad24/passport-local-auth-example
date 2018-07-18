const router = require('express').Router();
const AppName = require('../config').AppName;

router.get('/profile', (req, res) => {
    const name = req.body.name;

    res.render('profile', {
        name,
        AppName
    });
});

module.exports = router;