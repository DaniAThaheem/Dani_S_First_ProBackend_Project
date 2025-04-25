import { Router } from "express";
import { jwtVerify } from "../middlewares/auth.middleware.js";
import { addComment, deleteComment, getVideoComment, updateComment } from "../controllers/comment.controllers.js";

const router = Router()

router.use(jwtVerify)

router.route("/:videoID")
.get(getVideoComment)
.post(addComment)
router.route("/:commentID")
.patch(updateComment)
.delete(deleteComment)

export default router