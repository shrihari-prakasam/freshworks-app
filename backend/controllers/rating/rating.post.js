import Rating from "../../model/rating.js";

const POST__Rating = async (req, res) => {
    try {
        const { value } = req.body;
        const newRating = new Rating({ value });
        const savedRating = await newRating.save();
        res.json(savedRating);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create rating' });
    }
};

export default POST__Rating;
