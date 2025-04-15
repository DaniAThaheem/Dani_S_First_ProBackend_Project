
import { jwtVerify } from "../middlewares/auth.middleware.js";
import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { deleteVideo, getAllVideos, getVideoById, publishAVideo, togglePublishStatus, updateVideo } from "../controllers/video.controllers.js";

const router = Router()

router.use(jwtVerify)

router.route("/").get(getAllVideos)

router.route("/publish").post( 
    upload.fields(
        [
            {
                name: "video",
                maxCount: 1
            },
            {
                name: "thumbnail",
                maxCount: 1
            }
        ]
    ),
    publishAVideo)
router.route("/:videoID")
.post(
    getVideoById
)
.patch(
    upload.single("thumbnail"),
    updateVideo 
)
.delete(
    deleteVideo
)

router.route("/toggle/publish/:videoID")
.patch(togglePublishStatus)
export default router;