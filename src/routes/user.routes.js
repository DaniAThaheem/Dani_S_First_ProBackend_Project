import {router} from "express"
import { registerUser } from "../controllers/register.controllers.js";
import {upload} from "../middlewares/multer.middleware.js"

const router = router();

router.route("/register").post(
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

export default router