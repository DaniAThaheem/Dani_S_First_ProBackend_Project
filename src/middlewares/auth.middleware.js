import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";



const jwtVerify = asyncHandler(
    async (req, _, next)=>{
        try {
             const accessToken = req.cookies?.accessToken || req.header("Authorization").replace("Bearer ", "")
 
             console.log(accessToken);
             
             if(!accessToken){
                 throw new ApiError(401, "Unauthorized access")
             }
 
             const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
 
             
             
             const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
 
             if(!user){
                 throw new ApiError(400, "Invalid Access Token")
             }
 
             req.user = user
             next()
        } catch (error) {
             throw new ApiError(401, error?.message||"Invalid access token")
        }
    }
)

export {jwtVerify}