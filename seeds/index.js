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
                author: '627b889961b9e3f50f6f63d9',
                location: `${cities[random1000].city}, ${cities[random1000].state}`,
                title: `${sample(descriptors)}, ${sample(places)}`,
                description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut debitis ipsam eum repudiandae laboriosam! Impedit nostrum eius possimus doloremque asperiores iusto recusandae dolor quam, quaerat dignissimos eos alias ut maiores',
                price,
                geometry: {
                    type: "Point",
                    coordinates: [
                        cities[random1000].longitude,
                        cities[random1000].latitude,
                    ]
                },
                images: [
                    {
                        url: 'https://res.cloudinary.com/tolucoder/image/upload/v1652374046/YelpCamp/bzomog5da59ffuuksn82.png',
                        filename: 'YelpCamp/bzomog5da59ffuuksn82'
                    },
                    {
                        url: 'https://res.cloudinary.com/tolucoder/image/upload/v1652374046/YelpCamp/ny8sx7g89fhwp6gw9lem.png',
                        filename: 'YelpCamp/ny8sx7g89fhwp6gw9lem'
                    }
                ],

            }
        )
        await camp.save();
    }
}
seedDB().then(() => {
    mongoose.connection.close();
    console.log('Database closed')
});