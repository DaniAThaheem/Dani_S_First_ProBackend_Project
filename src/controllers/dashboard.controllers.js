import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";

const  getChannelStats = asyncHandler(async(req, res)=>{

    const {userID} = req.user._id
    // subscribers

    const channelStats = await User.aggregate(
        [
            {
                $match:{
                    _id: mongoose.Schema.Types.ObjectId(userID
                    )
                }
            },
            {
                $lookup:{
                    from:"subscriptions",
                    localField:"_id",
                    foreignField:"channel",
                    as:"subscribers",
                }
            },
            {
                $addFields:{
                    subscriberCount:{
                        $size: "$subscribers"
                    }
                }
            },
            {
                $lookup:{
                    from:"videos",
                    localField:"_id",
                    foreignField:"owner",
                    as:"uploadedVideos",
                    pipeline:[
                        {
                            $lookup:{
                                from:"likes",
                                localField:"_id",
                                foreignField:"video",
                                as:"likedVideos"
                            }
                        },
                        {
                            $addFields:{
                                countOfLikes:{
                                    $size:"$likedVIdeos"
                                },
                                countOfViews:{
                                    $size:"$views"
                                }
                            }
                        }

                    ]
                }
            },
            {
                $addFields:{
                    vidosCount:{
                        $size:"$uploadedVideos"
                    }
                }
            },
            //This unwind ripapart the videos array and each document conatins the same information of the user but the different video
            {
                $unwind:"$uploadedVideos"
            },
            //Group all the documents to apply aggregation functions and gives the total likes and views on all videos 
            {
                $group:{
                    _id:null,
                    totalLikes:{
                        $sum:"$uploadedVideos.countOfLikes"
                    },
                    totalViews:{
                        $sum:"$uploadedVideos.countOfViews"
                    }
                }
            },
            {
                $project:{
                    subscriberCount:1,
                    vidosCount,
                    totalLikes:1,
                    totalViews:1
                }
            }


        ]
    )

    if(!channelStats){
        throw new ApiError(500, "Could not get channel stats"            
        )
    }

    return res
    .statusCode(200)
    .json(
        new ApiResponse(
            200,
            channelStats[0],
            "Success fully fetched the channel stats"
        )
    )



})

const getChannelVideos = asyncHandler(async(req, res)=>{

    const {userID} = req.user._id

    const channelVideos = await Video.find(
        {
            owner: userID
        }       
    )

    if(!channelVideos){
        throw new ApiError(500, "Could not fetched uploaded videos")
    }

    return res
    .statusCode(200)
    .json(
        new ApiResponse(
            200,
            channelVideos,
            "Videos uploaded on the channel fetched successfully"
        )
    )
})

export {
    getChannelStats,
    getChannelVideos
}