import SubscriptionSale from '../../model/subscription-sale.js';

const POST__Sale = async (req, res) => {
    try {
        const { customerId, customerName, subscriptionPlan, saleDate } = req.body;
        const newSale = new SubscriptionSale({ customerId, customerName, subscriptionPlan, saleDate });
        const savedSale = await newSale.save();
        res.json(savedSale);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create sale' });
    }
};

export default POST__Sale;