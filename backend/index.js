import express from "express";
import bodyParser from 'body-parser';
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import SaleRouter from "./controllers/sale/routes.js";
import RatingRouter from "./controllers/rating/routes.js";
import { Configuration } from "./singleton/configuration.js";

const app = express()
const port = Configuration.get("app-port");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors())

app.use('/sale', SaleRouter);
app.use('/rating', RatingRouter);

mongoose.connect(Configuration.get("mongodb.url"), {
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