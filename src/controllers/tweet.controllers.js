import { Tweet } from "../models/tweet.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Logic 1:- Create a tweet

const createTweet = asyncHandler(async(req, res)=>{
    const owner = req.user._id;
    const {content} = req.body

    if(!content){
        throw new ApiError(400, "No content to tweet")
    }

    const tweet = await Tweet.create(
        {
            owner,
            content
        }
    )
    if(!tweet){
        throw new ApiError(500, "Error while making a tweet")
    }
    return res
    .statusCode(200)
    .json(
        new ApiResponse(
            200,
            tweet,
            "Tweet make successfully"
        )
    )
}
)

//Logic 2:- Get logic tweets

const getUserTweets = asyncHandler(async(req, res)=>{
    const {userID} = req.params

    const tweets = Tweet.findById(userID)

    if(!tweets){
        throw new ApiError(500, "Could not find tweets")
    }

    return res 
    .statusCode(200)
    .json(
        new ApiResponse(
            200,
            tweets,
            "Got All tweets"
        )
    )

})

//Logic 3:- Update Tweets

const updateTweet = asyncHandler(async(req, res)=>{
    const {tweetID} = req.params
    const {content} = req.body

    const updatedTweet = Tweet.findByIdAndUpdate(
        {tweetID},
        {
            $set:{
                content
            }
        },
        {
            new: true
        }
    )
    if( !updatedTweet){
        throw new ApiError(
            500, "Could not update tweet"
        )
    }
    return res
    .statusCode(200)
    .json(
        new ApiResponse(
            200,
            updatedTweet,
            "Tweet updated successfully"
        )
    )

})

// Logic 4:- Delete Tweet
const deleteTweet = asyncHandler(async(req, res)=>{
    const {tweetID} = req.params
    const tweetDelStatus = Tweet.findByIdAndDelete(tweetID)
    if(!tweetDelStatus){
        throw new ApiError(500, "Could not delete status")
    }
    return res
    .statusCode(203)
    .json(
        new ApiResponse(
            203,
            null,
            "Tweet deleted successfully"
        )
    )
})

export{
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}