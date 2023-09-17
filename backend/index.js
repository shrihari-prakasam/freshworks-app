import express from "express";
import bodyParser from 'body-parser';
import SaleRouter from "./controllers/sale/routes.js";
import mongoose from "mongoose";
import cors from "cors";
import RatingRouter from "./controllers/rating/routes.js";
const app = express()
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors())

app.use('/sale', SaleRouter);
app.use('/rating', RatingRouter);

mongoose.connect('mongodb://localhost:27017/subscription_sales_db', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})