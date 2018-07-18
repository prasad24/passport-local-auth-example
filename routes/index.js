const router = require('express').Router();
const AppName = require('../config').AppName;

router.get('/', (req, res) => {
    res.render('index', {
        AppName
    });
});

module.exports = router;