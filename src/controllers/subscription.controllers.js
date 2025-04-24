import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {mongoose} from "mongoose";
import { Subscription } from "../models/subscription.model.js";


const toggleSubscription = asyncHandler( async(req, res)=>{
    const {channelId} = req.params
    const userID = req.user?._id
    console.log((channelId));
    
    
    //check if the user is subscriber of the channel then remove or pull it out out of the arry
    const SubscribedChannel = await Subscription.find(
        {
            channel: channelId,
            subscriber: userID
        }
    )
    console.log(SubscribedChannel);
    

    if(SubscribedChannel.length!==0){
        try {
            const deletionResult = await Subscription.findByIdAndDelete(SubscribedChannel[0]._id)
            return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    deletionResult,
                    "Subscriber removed successfully"
                )
            )
            
        } catch (error) {
            throw new ApiError(500, "error while removing subscription", error)
        }
    }

    const subscription = await Subscription.create(
        {
            channel: channelId,
            subscriber: userID
        }
    )

    if(!subscription){
        throw new ApiError(500,  "Could not create document")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            subscription,
            "User subscribed the channel successfully"
        )
    )
})

const getSubscribedChannels = asyncHandler( async(req, res)=>{
    const {channelId} = req.params
    console.log(channelId);
    

    const channel = await User.aggregate([
        {
            $match:{
                _id: new mongoose.Types.ObjectId(channelId)
            }
        },
        //Finding the channels the specified channel is subscriber of 
        {
            $lookup:{
                from:"subscriptions",
                localField:"_id",
                foreignField:"subscriber",
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
    if(channel.length===0){
        throw new ApiError(500, "Could not get subscribed channel")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {subscribdChannels:channel[0].subscribedChannelCount},
            "Got subscribed channel successfully"
        )
    )


})

const getUserChannelSubscribers = asyncHandler(async(req, res)=>{
    const {subscriberId} = req.params

    const channel = await User.aggregate([
        {
            $match:{
                _id: new mongoose.Types.ObjectId(subscriberId)
            }
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

    if(channel.length===0){
        throw new ApiError(500, "Could not get the subscribers")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {subscribers:channel[0].subscriberCount},
            "Subscribers count got successfully"
        )
    )
})

export {
    toggleSubscription,
    getSubscribedChannels,
    getUserChannelSubscribers
}
