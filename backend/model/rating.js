import mongoose from "mongoose";

const Rating = mongoose.model('Rating', {
    value: Number,
});

export default Rating;