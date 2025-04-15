import { Router } from "express";
import { jwtVerify } from "../middlewares/auth.middleware.js";
import { addVideoToPlaylist, allUserPlaylists, createPlaylist, deletePlaylist, getPlaylistById, removeVideoFromPlaylist, updatePlaylist } from "../controllers/playlist.controllers.js";

const router = Router()


router.use(jwtVerify)

router.route("/").post(createPlaylist)
router.route("/:userID").get(allUserPlaylists)
router.route("/add/:videoID/:playlistID").patch(addVideoToPlaylist)
router.route("/remove/:videoID/:playlistID").patch(removeVideoFromPlaylist)
router.route("/:playlistID")
.get(getPlaylistById)
.patch(updatePlaylist)
.delete(deletePlaylist)
export default router