const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    autoIndex: true,
    useUnifiedTopology: true
}) //creates a database Yelp-Camp with some options 

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
}); // logic to check if there is an error & successfully opened

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
const port = 3000;

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/campground', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
});

app.get('/campground:id', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/show', { campgrounds })
});




app.listen(port, () => {
    console.log(`Listening on port ${port}`)
});

