import express from "express";
const SaleRouter = express.Router();
import POST__Sale from "./sale.post.js";
import GET__Sale from "./sale.get.js";

SaleRouter.post('/', POST__Sale);
SaleRouter.get('/', GET__Sale);

export default SaleRouter;