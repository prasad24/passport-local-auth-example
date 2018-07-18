const router = require('express').Router();
const AppName = require('../config').AppName;

router.get('/', (req, res) => {

    const user = req.user;
    console.log(user);

    res.render('index', {
        AppName,
        user
    });
});

module.exports = router;