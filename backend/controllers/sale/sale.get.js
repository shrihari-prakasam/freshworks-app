import SubscriptionSale from '../../model/subscription-sale.js';

const GET__Sale = async (req, res) => {
    try {
        const currentDate = new Date();
        const lastSixMonths = new Date(currentDate.getFullYear(), currentDate.getMonth() - 6, 1);

        const sales = await SubscriptionSale.aggregate([
            {
                $match: {
                    saleDate: { $gte: lastSixMonths, $lte: currentDate },
                },
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$saleDate' },
                        month: { $month: '$saleDate' },
                    },
                    count: { $sum: 1 },
                },
            },
            {
                $sort: {
                    '_id.year': 1,
                    '_id.month': 1,
                },
            },
        ]);

        res.json(sales);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch sales by month' });
    }
};

export default GET__Sale;