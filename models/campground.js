const mongoose = require('mongoose');
const review = require('./review');
const { Schema } = mongoose;

const CampgroundSchema = new Schema({
    title: String,
    image: String,
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
    ]
});
/**Campground Delete middleware */
CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await review.deleteMany({ _id: { $in: doc.reviews } })
    }
})


module.exports = mongoose.model('Campground', CampgroundSchema);