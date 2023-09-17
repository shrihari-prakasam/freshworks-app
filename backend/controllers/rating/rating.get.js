import Rating from "../../model/rating.js";

const GET__Rating = async (req, res) => {
    try {
        const ratingCounts = await Rating.aggregate([
            {
                $group: {
                    _id: '$value',
                    count: { $sum: 1 },
                },
            },
        ]);

        const counts = {};
        ratingCounts.forEach((rating) => {
            counts[rating._id] = rating.count;
        });

        res.json(counts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch rating counts' });
    }
}

export default GET__Rating;