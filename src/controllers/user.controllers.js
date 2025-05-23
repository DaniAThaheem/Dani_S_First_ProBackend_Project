import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import {cloudinaryUpload} from "../utils/cloudinaryUpload.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import jwt  from "jsonwebtoken"
import { mongoose } from "mongoose"
import {cloudinaryDestroy} from "../utils/cloudinaryDestroy.js"

//Generate access and refresh token

const generateAccessAndRefreshToken = async(userId)=>{
    const user = await User.findById(userId)
    
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({validateBeforeSave: false})
    
    return {accessToken, refreshToken}
}

//Register User
const registerUser = asyncHandler(
    async(req, res)=>{
        const {username, email, fullname, password} = req.body;
        console.log(username, email, fullname, password)

        if(
            [username, email, fullname, password]
            .some((field)=> field?.trim()==="")
        )
        {
            throw new ApiError(400, "All the given fields are required")

        }

        const isUserExists = await User.findOne(
            {
                $or:[
                    {username}, {email}
                ]
            }
        )

        if(isUserExists){
            throw new ApiError(409, "User Already Exists")
        }

        const avatarUrl = req.files?.avatar[0]?.path
        const coverImageUrl = req.files?.coverImage[0]?.path

        if(!avatarUrl){
            throw new ApiError(400, "Avatar is necessary field")
        }

        const avatar = await cloudinaryUpload(avatarUrl)
        const coverImage = await cloudinaryUpload(coverImageUrl)

        if(!avatar){
            throw new ApiError(500, "Couldn't upload file on cloudinary")
        }
        
        const user = await User.create(
            {
                username,
                email,
                password,
                fullname,
                avatar: avatar.url,
                coverImage: coverImage.url
            }
        )

        const userResponse = await User.findById(user._id).select(
            "-password -refreshToken"
        )

        if(!userResponse){
            throw new ApiError(500, "Couldn't register user")
        }
        
        return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                userResponse,
                "User Registered Success fully"
            
            )
        )


    }
)


//Login User
const loginUser = asyncHandler(
    async(req, res)=>{
        const {username, email, password} = req.body;
        console.log(username, email, password);
        
        if(!(username||email)){
            throw new ApiError(400, "Username or Email is required field")

        }
        const user = await User.findOne({
            $or:[
                {username},
                {email}
            ]
        })
        if(!password){
            throw new ApiError(400, "password is necessary field")
        }
        
        const isPwdCorrect = await user.isPasswordCorrect(password)
        console.log(isPwdCorrect);
        if(!isPwdCorrect){
            throw new ApiError(401, "Invalid Password")
        }

        const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id);

        const  loggedInUser = await User.findById(user._id).select("-password -refreshToken")
        const options = {
            httpOnly: true,
            secure: true
        }
        
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    loggedInUser,
                    accessToken, 
                    refreshToken
                },
                "User Logged In Successfully"
            )
        )
    }
)

//Logout User

const logoutUser = asyncHandler(
    async(req, res)=>{
        const userId = req.user?._id
        console.log(await User.findById(userId));
        
        const logoutUser = await User.findOneAndUpdate(
            userId,
            {
                $unset:{
                    refreshToken: 1
                }
            },
            {
                new: true
            }
        )
        
        const options = {
            httpOnly: true,
            secure: true
        }
        return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(
                200,
                {
                },
                "Logout Successfully"
            )
        )
        

    }

)
const refreshAccessToken = asyncHandler(
    async(req, res)=>{
        const userRefreshToken = req.cookies.refreshToken || req.body.refreshToken
        console.log(userRefreshToken);
        
        if(!userRefreshToken){
            throw new ApiError(401, "Invalid Refresh Token")
        }
        console.log(process.env.REFRESH_TOKEN_SECRET);
        
        const decodedToken = jwt.verify(userRefreshToken, process.env.REFRESH_TOKEN_SECRET)
        console.log(decodedToken);
        
        const user = await User.findById(decodedToken?._id)
        if(!user){
            throw new ApiError(401, "Invalid Cridentials")
        }

        if(userRefreshToken !== user?.refreshToken){
            throw new ApiError(401, "Invalid Cridentials")
        }
        const {accessToken, refreshToken} = await generateAccessAndRefreshToken(decodedToken._id)


        const options = {
            httpOnly : true,
            secure: true
        }

        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user,
                    accessToken,
                    refreshToken
                },
                "Access token refreshed successfully"
            )
        )


    }
)

const changePassword = asyncHandler(
    async(req, res)=>{
        const { oldPassword,newPassword } = req.body
        console.log(oldPassword, newPassword);
        
        const user = await User.findById(req.user?._id)

        const isPwdOkay = await user.isPasswordCorrect(oldPassword)
        console.log(isPwdOkay);
        
        if(!isPwdOkay){
            throw new ApiError(401, "Invalid Password")
        }
        user.password = newPassword

        await user.save({validateBeforeSave:false})

        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Password modified successfully"
            )
        )
    }
)

const getUserData = asyncHandler(
    async(req, res)=>{
        return res
        .status(200)
        .json(
           new ApiResponse(
            200,
            req.user,
            "User Returned Successfully"
           )
        )
    }
)

const updateUser = asyncHandler(
    async(req, res)=>{
        const {fullname, email} = req.body
        if(!fullname || !email){
            throw new ApiError(400 , "fullName or email are required")
        }

        const user = await User.findByIdAndUpdate(
            req.user?._id,
            {
                $set:{
                    fullname,
                    email
                }
            },
            {
                new: true
            }
        ).select("-password -refreshToken")
        return res    
        .status(200)
        .json(
            new ApiResponse(
                200,
                user,
                "User Update Successfully"
            )
        )
    }
)

const updateAvatar = asyncHandler(
    async(req, res)=>{
        const avatarUrl = req.file.path               //?.avatar[0]?.path
        if(!avatarUrl){
            throw new ApiError(400, "Avatar Required")
        }

        const oldUser = await User.findById(req.user?._id)
        console.log(oldUser);
        
        const result = await cloudinaryDestroy(oldUser.avatar)
        console.log(result);
        
        if(result !== 'ok'){
            throw new ApiError(500, "failed to delete file from cloudinary")
        }
        console.log(avatarUrl);
        
        const avatar = await cloudinaryUpload(avatarUrl)

        const user = await User.findOneAndUpdate(
            req.user?._id,
            {
                avatar:avatar.url
            },
            {
                new: true
            }
        ).select("-password -refreshToken")

        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                user,
                "Files updated successfully"
            )
        )
        

    }
)

const updateCoverImage = asyncHandler(async(req, res)=>{
    const coverImageUrl = req.file.path               //?.avatar[0]?.path
        if(!coverImageUrl){
            throw new ApiError(400, "coverImage Required")
        }

        const oldUser = await User.findById(req.user?._id)
        console.log(oldUser);
        
        const result = await cloudinaryDestroy(oldUser.coverImage)
        console.log(result);
        
        if(result !== 'ok'){
            throw new ApiError(500, "failed to delete file from cloudinary")
        }
        console.log(coverImageUrl);
        
        const coverImage = await cloudinaryUpload(coverImageUrl)

        const user = await User.findOneAndUpdate(
            req.user?._id,
            {
                coverImage:coverImage.url
            },
            {
                new: true
            }
        ).select("-password -refreshToken")

        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                user,
                "Files updated successfully"
            )
        )
})

const getUserInfo = asyncHandler(
    async(req, res)=>{

        const {username} = req.params;
        
        const userInfo = await User.aggregate(
        [
            {
                $match:{
                    username : username?.toLowerCase()
                }
            },
            {
                $lookup:{
                    from:"subscriptions",
                    localField:"_id",
                    foreignField:"channel",
                    as: "subscribers"
                }
            },
            {
                $lookup:{
                    from:"subscriptions",
                    localField:"_id",
                    foreignField:"subscriber",
                    as: "subscribedTo"

                }
            },
            {
                $addFields:{
                    subscriberCount:{
                        $size:"$subscribers"
                    },
                    subscribedToCount:{
                        $size:"$subscribedTo"
                    }
                    ,
                    isSubscribed:{
                        $cond:{
                            if:{
                                $in:[
                                    req.user?._id,
                                    "$subscribers.subscriber"]
                            },
                            then:true,
                            else:false
                        }
                        
                    }
                }
            },
            {
                $project:{
                    fullName:1,
                    username:1,
                    email:1,
                    avatar:1,
                    coverImage:1,
                    subscriberCount:1,
                    subscribedToCount:1,
                    isSubscribed:1
                }
            }
        ]
        )
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                userInfo,
                "Info fetched successfully"
            )
        )
    }
)

const getWatchHistory = asyncHandler(
    async(req, res)=>{
        const uID = req.user?._id;

        const user = await User.aggregate(
            [
                {
                    $match:{
                        _id: new mongoose.Types.ObjectId(uID)
                    }
                },
                {
                    $lookup:{
                        from: "videos",
                        localField:"watchHistory",
                        foreignField:"_id",
                        as:"watchHistory",
                        pipeline:[
                            {
                                $lookup:{
                                    from:"users",
                                    localField:"owner",
                                    foreignField:"_id",
                                    as:"owner",
                                    pipeline:[
                                        {
                                            $project:{
                                                fullName:1,
                                                username:1,
                                                avatar:1,
                                                email:1
                                            }
                                        }
                                    ]

                                }
                            },
                            {
                                $addFields:{
                                    owner:{
                                        $first:"$owner"
                                    }
                                }
                            }
                        ]
                    }
                }
            ]
        )
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                user[0].watchHistory,
                "watchHistory fetched successfully"
            )
        )
    }
)

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changePassword,
    getUserData,
    updateUser,
    updateAvatar,
    updateCoverImage,
    getUserInfo,
    getWatchHistory

    
    }