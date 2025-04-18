import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";



const jwtVerify = asyncHandler(
    async(req, _, next)=>{
        const accessToken = req.cookies.accessToken || req.header("Authorization").replace("bearer ", "")


        const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)

        
        if(!user){
            throw new ApiError(400, "Invalid Access Token")
        }
        const user = await User.findOne(decodedToken?._id).select("-password -refreshToken")

        req.user = user
        next()
    }
)

export {jwtVerify}