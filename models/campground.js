const mongoose = require('mongoose');
const review = require('./review');
const { Schema } = mongoose;

const ImageSchema = new Schema({
    url: String,
    filename: String
});

const opts = { toJSON: { virtuals: true } };

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200')
}); // Image transformation virtuals from cloudinary integrated into mongoose

const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    location: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
}, opts);

CampgroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `${this._id}`;
});
CampgroundSchema.virtual('properties.popUpMarkup2').get(function () {
    return `${this.title}`;
});
CampgroundSchema.virtual('properties.popUpMarkup3').get(function () {
    return `<p>${this.description.substring(0, 20)}...</p>`;
});

/**Campground Delete middleware */
CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await review.deleteMany({ _id: { $in: doc.reviews } })
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema);