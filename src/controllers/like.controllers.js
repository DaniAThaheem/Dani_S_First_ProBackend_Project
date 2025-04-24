import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { mongoose } from "mongoose";
const toggleVideoLike = asyncHandler( async (req, res)=>{
    const {videoID} = req.params
    const userID = req.user?._id

    //find by video and user id
    const existingLike = await Like.findOne(
        {
           video: videoID,
           likedBy: userID
        }
    )
    
    //if found just delete them
    if(existingLike){
        try {
            await Like.findByIdAndDelete(existingLike._id)
            return res
            .status(203)
            .json(
                new ApiResponse(
                    203,
                    null,
                    "Video Unliked success fully"
                )
            )

        
        } catch (error) {
            throw new ApiError(500, "Could not toggle unlike video",error)
            
        }
    }

    //if not found just create a new object
    const toggleLiked = await Like.create(
        {
            video:videoID,
            likedBy:userID
        }
    )

    if(!toggleLiked){
        throw new ApiError(500, "Could not toggle like video")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            toggleLiked,
            "Video toggle to like successfully"
        )
    )
})

const toggleCommentLike = asyncHandler(async(req, res)=>{
    const {commentID} =req.params
    const userID = req.user?._id

    const existingLike = await Like.findOne(
        {
            comment:commentID,
            likedBy:userID
        }
    )

    if(existingLike){
        try {
            await Like.findByIdAndDelete(existingLike._id)
            return res
            .status(203)
            .json(
                new ApiResponse(
                    203,
                    null,
                    "Comment toggled to unlike successfully"
                )
            )
            
        } catch (error) {
            throw new ApiError(500, "Could not toggle to unlike")
            
        }
    }

    const toggleLiked = await Like.create(
        {
            comment:commentID,
            likedBy:userID
        }
    )
    if(!toggleLiked){
        throw new ApiError(500, "Could not toggle to like")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            toggleLiked,
            "comment toggle to be liked successfully"
        )
    )
})

const toggleTweetLike = asyncHandler(async(req, res)=>{
    const {tweetID} = req.params
    const userID = req.user?._id
    const existingLike = await Like.findOne(
        {
            tweet:tweetID,
            likedBy:userID
        }
    )
    
    if(existingLike){
        try {
            await Like.findByIdAndDelete(existingLike._id)
            return res
            .status(203)
            .json(
                new ApiResponse(
                    203,
                    null,
                    "Comment toggled to unlike successfully"
                )
            )
            
        } catch (error) {
            throw new ApiError(500, "Could not toggle to unlike")
            
        }
    }
    
    const toggleLiked = await Like.create(
        {
            tweet:tweetID,
            likedBy:userID
        }
    )
    if(!toggleLiked){
        throw new ApiError(500, "Could not toggle to like")
    }
    
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            toggleLiked,
            "tweet toggle to be liked successfully"
        )
    )
})

const getLikedVideos = asyncHandler(async(req, res)=>{
    const  userID  = req.user?._id
    console.log(userID);

    const userInfo =await User.findById(userID)

    console.log(userInfo);
    
    const userWithVideos = await User.aggregate(
        [
            //Fetched the user
            {
                $match:{
                    username: userInfo.username

                }
            },
            // //Get all documents liked by the users
            {
                $lookup:{
                    from:"likes",
                    localField:"_id",
                    foreignField:"likedBy",
                    as:"liked"
                }

            }
            ,
            //Ripapart the array of documents 
            {
                $unwind:"$liked"
            },
            //Keep only the documents with the video field
            {
                $match:{
                    "liked.video":{
                        $exists:true
                    }
                }
            },
            //Fetch the details of all liked videos
            {
                $lookup:{
                    from:"videos",
                    localField:"liked.video",
                    foreignField:"_id",
                    as:"videoDetail"
                }
            },
            //Flatten the array to get simply object
            {
                $addFields:{
                    videoDetail:{
                        $first:"$videoDetail"
                    },
                
                }
            }
        ]
    )

    if(!userWithVideos){
        throw new ApiError(500, "Could not fetch videos")
    }
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            userWithVideos,
            "All videos fetched successfully"
        )
    )
})


export {
    toggleVideoLike,
    toggleCommentLike,
    toggleTweetLike,
    getLikedVideos

}