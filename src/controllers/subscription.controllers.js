import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const toggleSubscription = asyncHandler( async(req, res)=>{
    const {channelID} = req.params
    const {userID} = req.user?._id





})

const getSubscribedChannels = asyncHandler( async(req, res)=>{
    const {channelID} = req.params

    const channel = await User.aggregate([
        {
            $match:channelID
        },
        //Finding the channels the specified channel is subscriber of 
        {
            $lookup:{
                from:"subscriptions",
                localField:"_id",
                foreignField:"subsciber",
                as:"subscribedTo"
            }
        },
        //Caluculating the total channels the specified channel has been subscribed
        {
            $addFields:{
                subscribedChannelCount:{
                    $size: "$subscribedTo"
                }
            }
        }
    ])
    if(!channel){
        throw new ApiError(500, "Could not get subscribed channel")
    }

    return res
    .statusCode(200)
    .json(
        new ApiResponse(
            200,
            channel[0].subscribedChannelCount,
            "Got subscribed channel successfully"
        )
    )


})

const getUserChannelSubscriber = asyncHandler(async(req, res)=>{
    const {subscriberID} = req.params

    const channel = await User.aggregate([
        {
            $match:subscriberID
        },

        //Fetching all users form which have subscribed the resultant channel of above stage --- it returns an array of objects that contains the user subscribed a specific channel
        {
            $lookup:{
                from:"subscriptions",
                localField:"_id",
                foreignField:"channel",
                as:"subscribers"
            }
        },
        //Counting the size of array because we want to get no of subscribers
        {
            $addFields:{
                subscriberCount:{
                    $size: "$subscribers"
    
                }
            }
        }
    ])

    if(!channel){
        throw new ApiError(500, "Could not get the subscribers")
    }

    return res
    .statusCode(200)
    .json(
        new ApiResponse(
            200,
            channel[0].subscriberCount,
            "Subscribers count got successfully"
        )
    )
})


