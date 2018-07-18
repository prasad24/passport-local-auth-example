const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');

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