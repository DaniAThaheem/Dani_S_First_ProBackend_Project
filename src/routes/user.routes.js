import express from "express"
import {upload} from "../middlewares/multer.middleware.js"
import { changePassword, getUserData, getUserInfo, getWatchHistory, loginUser, logoutUser, refreshAccessToken, registerUser, updateAvatar, updateCoverImage, updateUser } from "../controllers/user.controllers.js";
import { jwtVerify } from "../middlewares/auth.middleware.js";

const router = express.Router();
//remove the middleware then send the request

router.route('/').get((req, res)=>{
    res.send("api is running in user.routes.js...")
})

router.route('/register').post(
    upload.fields(
        [
            {   
                name:"avatar",
                maxCount:1
            },
            {
                name: "coverImage",
                maxCount:1
            }
        ]
    )
    ,registerUser)

router.route('/login').get(loginUser)
router.route('/logout').get(jwtVerify, logoutUser)
router.route('/refresh-token').post(refreshAccessToken)
router.route('/change-password').post(jwtVerify, changePassword)
router.route('/current-user').get(jwtVerify, getUserData)
router.route('/update-account').patch(jwtVerify, updateUser)
router.route('/avatar').patch(jwtVerify, upload.single("avatar"), updateAvatar)
router.route('/coverImage').patch(jwtVerify, upload.single("coverImage"), updateCoverImage)
router.route('/c/:username').get(jwtVerify,getUserInfo)
router.route('/history').get(jwtVerify, getWatchHistory)
export default router