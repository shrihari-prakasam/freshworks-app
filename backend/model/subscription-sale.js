import mongoose from 'mongoose';

const subscriptionSaleSchema = new mongoose.Schema({
    customerName: String,
    subscriptionPlan: String,
    saleDate: Date,
});

export default mongoose.model('SubscriptionSale', subscriptionSaleSchema);
