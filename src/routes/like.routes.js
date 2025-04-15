import { Router } from "express";
import { jwtVerify } from "../middlewares/auth.middleware.js";
import { getLikedVideos, toggleCommentLike, toggleTweetLike, toggleVideoLike } from "../controllers/like.controllers.js";

const router = Router()

router.use(jwtVerify)

router.route("/toggle/v/:videoID").post(toggleVideoLike)
router.route("/toggle/c/:commentID").post(toggleCommentLike)
router.route("/toggle/t/:tweetID").post(toggleTweetLike)
router.route("/videos").get(getLikedVideos)
export default router