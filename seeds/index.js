const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers')
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    autoIndex: true,
    useUnifiedTopology: true
}) //creates a database Yelp-Camp with some options 

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({}); // To Clear our Database
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground(
            {
                location: `${cities[random1000].city}, ${cities[random1000].state}`,
                title: `${sample(descriptors)}, ${sample(places)}`,
                // image: 'https://picsum.photos/300/200',
                image: 'https://source.unsplash.com/random',
                description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut debitis ipsam eum repudiandae laboriosam! Impedit nostrum eius possimus doloremque asperiores iusto recusandae dolor quam, quaerat dignissimos eos alias ut maiores',
                price
            }
        )
        await camp.save();
    }
}
seedDB().then(() => {
    mongoose.connection.close();
    console.log('Database closed')
});