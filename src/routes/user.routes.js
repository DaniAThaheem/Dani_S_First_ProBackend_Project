import express from "express"
import {upload} from "../middlewares/multer.middleware.js"
import { loginUser, logoutUser, registerUser } from "../controllers/user.controllers.js";
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

router.route('/login').post(loginUser)
router.route('/logout').get(jwtVerify, logoutUser)

export default router