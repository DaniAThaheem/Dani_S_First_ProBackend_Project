import { Router } from "express";
import { jwtVerify } from "../middlewares/auth.middleware.js";
import { createTweet, deleteTweet, getUserTweets, updateTweet } from "../controllers/tweet.controllers.js";

const router = Router()

router.use(jwtVerify)

router.route("/").post(createTweet)
router.route("/user/:userID").get(getUserTweets)
router.route("/:tweetID")
    .patch(updateTweet)
    .delete(deleteTweet)

export default router