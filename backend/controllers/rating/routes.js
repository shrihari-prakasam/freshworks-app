import express from "express";
const RatingRouter = express.Router();
import POST_Rating from "./rating.post.js";
import GET__Rating from "./rating.get.js";

RatingRouter.post('/', POST_Rating);
RatingRouter.get('/', GET__Rating);

export default RatingRouter;