const localStrategy = require('passport-local').Strategy;
const User = require('./models/user');

function configure(passport) {
    const localStrategyFunc = (username, password, done) => {
        User.login(username, password, (err, user) => {
            if(err) {
                console.log('In Local Passport Strategy Error', err);
                done(err, false);
            } else if (user) {
                console.log('In Local Passport Strategy Success', user);
                done(null, user);
            } else {
                console.log('In Local Passport Strategy Login Failed');
                done(null, false, {
                    message: "Invalid username or password",
                    username: username
                });
            }
        });
    }

    passport.use(new localStrategy(localStrategyFunc));

    passport.serializeUser((user, done)=> {
        done(null, user.id);
    });

    // Puts the user object in the session
    passport.deserializeUser((id, done)=> {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });
}

module.exports = {
    configure
}
