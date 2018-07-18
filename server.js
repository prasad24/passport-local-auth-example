const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const flash = require('express-flash-messages');

const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const passportConfig = require('./passport-config');


const app = express();

mongoose.connect('mongodb://localhost:27017/nodeauth', {
    useNewUrlParser: true
},
 (err) => {
    if(err) {
        console.log('Error connecting to mongodb', err);
    }
})

app.set('view engine', 'ejs');

//session
app.use(session({
    secret: 'asasasfwet345534sdsdgs',
    saveUninitialized: false,
    resave: false
}))

//passport
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
passportConfig.configure(passport);

//setup express body parser
app.use(express.json());
app.use(express.urlencoded({extended: false}));

//set static folder
app.use(express.static(path.join(__dirname, 'public')));

//Routes
app.use(indexRoutes);
app.use(authRoutes);
app.use(profileRoutes);

app.listen(3000, () => {
    console.log('App listening on port 3000');
});