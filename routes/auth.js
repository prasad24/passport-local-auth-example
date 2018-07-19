const router = require('express').Router();
const passport = require('passport');
const { check, validationResult } = require('express-validator/check');
const { sanitize } = require('express-validator/filter');

const AppName = require('../config').AppName;
const User = require('../models/user');

router.get('/login', (req, res) => {

    let formdata = null;
    const messages = res.locals.getMessages();
    let error =  messages.error && messages.error.length ? messages.error[0] : null;
    if(error) {
        formdata = messages.formdata && messages.formdata.length ? messages.formdata[0] : null;
    }
    res.render('login', {
        AppName,
        error,
        formdata
    });
});

//Local authentication using passport
router.post('/login', (req, res, next) => {
    req.flash('formdata', req.body);
    next();
}, passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
}));

router.get('/register', (req, res) => {
    const { error, forminputs } = res.locals.getMessages();
    let errors = {};
    if(error) {
        error.map(value => {
            errors[value.param] = value.msg;
        });
    } else {
        errors = null;
    }
    const formdata = forminputs && forminputs.length ? forminputs[0] : null;
    console.log(errors, formdata)
    res.render('register', {
        AppName,
        errors,
        formdata
    });
});

router.post(
    '/register',
    [
        check('name','Required')
            .not().isEmpty()
            .trim(),
        check('email')
            .not().isEmpty().withMessage('Required')
            .isEmail().withMessage('Not a valid email format')
            .trim(),
        check('username')
            .not().isEmpty().withMessage('Required')
            .isLength({min: 6}).withMessage('Minimum length 6 characters')
            .trim(),
        check('password')
            .not().isEmpty().withMessage('Required')
            .isLength({min: 6}).withMessage('Minimum length 6 characters'),
        check('confirmpassword')
            .not().isEmpty().withMessage('Required')
            .custom((value, {req}) => {
                if (value !== req.body.password) {
                    return false;
                }
                return true;
            }).withMessage('Does not match password')
    ],
    (req, res, next) => {
        const { name, email, username, password } = req.body;
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            errors.array({ onlyFirstError: true }).map(error => {
                req.flash('error', { param: error.param, msg: error.msg });
            })
            req.flash('forminputs', req.body);
            res.redirect('/register');
        } else {
            const user = new User({name, email, username, password});
            user.save(err => {
                if(err) {
                    console.log('Error saving user', err);
                    if(err.message.indexOf('duplicate key error') > -1) {
                        req.flash('error', {param: 'username', msg: 'Username already exists'});
                        req.flash('forminputs', req.body);
                    } else {
                        req.flash('error', {param: 'other', msg: 'Sorry! We are unable to complete the registration now, please try again later'});
                    }

                    res.redirect('/register');
                } else {
                    next();
                }
            });
        }
    },
    passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/login'
}));

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;