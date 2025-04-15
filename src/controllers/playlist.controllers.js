import mongoose from "mongoose";
import { Playlist } from "../models/playlist.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import req from "express/lib/request";

//Logic 1:- Create a new playlist
const createPlaylist = asyncHandler( async(req, res)=>{
    const {name, description} = req.body;
    const {owner} = req.user?._id

    if(!(name || description)){
        throw new ApiError(400, "name or description of the playlist is not given")
    }

    const playlist = await Playlist.create({
        name,
        description,
        owner
    })

    if(!playlist){
        throw new ApiError(500, "Could not create playlist")
    }

    return res
    .statusCode(200)
    .json(
        new ApiResponse(
            200,
            playlist,
            "New playlist created successfully"
        )
    )
})

// Logic 2:- Get All Playlists 

const allUserPlaylists = asyncHandler( async(req, res)=>{
    const {userID} = req.params

    const playlists = await Playlist.aggregate(
        [
            {
                //Get all the videos of the owner with that user ID
                $match:{
                    owner: mongoose.Schema.Types.ObjectId(userID)
                }
            },
            {
                $lookup:{
                    from:"videos",
                    localField:"videos",
                    foreignField:"_id",
                    as:"videos",
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
                        }
                    ]
                }
            },
            {
                $addFields:{
                    owner:{
                        $first:"$videos"
                    }
                }
            }
        ]
    )

    if(!playlists){
        throw new ApiError(500, "Could not fetch playlists")
    }

    return res
    .statusCode(200)
    .json(
        new ApiResponse(
            200,
            playlists,
            "Playlists fetched successfully"
        )
    )
})


// Logic 3:- Get playlist by id
const getPlaylistById = asyncHandler( async(req, res)=>{
    const {playlistID} = req.params

    const playlist = await Playlist.aggregate(
        [
            {
                $match:{
                        _id:mongoose.Schema.Types.ObjectId(playlistID)
                }
            },
            {
                $lookup:{
                    from:"videos",
                    localField:"videos",
                    foreignField:"_id",
                    as:"videos",
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
                        }
                    ]
                }
            },
            {
               $addFields:{
                videos:{
                    $first: "$videos"
                }
               } 
            }

        ]
    )
    if(!playlist){
        throw new ApiError(500, "Could not find a playlist")
    }
    return res
    .statusCode(200)
    .json(
        new ApiResponse(
            200,
            playlist,
            "Fetched playlist successfully"
        )
    )
})


const addVideoToPlaylist = asyncHandler(async(req, res)=>{
    const {videoID, playlistID} = req.params

    const updatedPlaylistContent = await Playlist.findByIdAndUpdate(
        {playlistID},
        {
            $push:{
                videos:videoID
                    
                
            }
        },
        {
            new: true
        }
    )
    if(!updatedPlaylistContent){
        throw new ApiError(500, "Could not add video to the playlist")
    }

    return res
    .statusCode(200)
    .json(
        new ApiResponse(
            200,
            updatedPlaylistContent,
            "Video Added to the playlist successfully"
        )
    )

})


const removeVideoFromPlaylist = asyncHandler(
    async( req, res)=>{
        const {videoID, playlistID} = req.params

        const updatedPlaylistContent = await Playlist.findByIdAndUpdate(
            playlistID,
            {
                $pull:{
                    videos:videoID
                }
            },
            {
                new:true
            }
        )
        if(!updatedPlaylistContent){
            throw new ApiError(500, "Could not remove video from  the playlist")
        }
        return res
        .statusCode(200)
        .json(
            new ApiResponse(
                200, 
                updatedPlaylistContent,
                "Video removed form the playlist successfully"
            )
        )
    }
)
const updatePlaylist = asyncHandler(async(req, res)=>{
    const {playlistID} = req.params
    const {name, description} = req.body

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        {playlistID},
        {
            $set:{
                name: name,
                description: description
            }
        },
        {
            new: true
        }
    )
    if(!updatedPlaylist){
        throw new ApiError(500, "Could not update playlist information")
    }

    return res 
    .statusCode(200)
    .json(
        new ApiResponse(
            200,
            updatePlaylist,
            "Playlist information updated successfully"
        )
    )
})

const deletePlaylist = asyncHandler( async( req, res )=>{
    const {playlistID} = req.params
    
    const deletedPlaylisst = await Playlist.findByIdAndDelete({playlistID})

    if(!deletePlaylist){
        throw new ApiError(500, "Could not delete the playlist ")
    }
    return res
    .statusCode(203)
    .json(
        new ApiResponse(
            203,
            null,
            "Playlist deleted successfully"
        )
    )
})




export { 
    createPlaylist,
    allUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    updatePlaylist,
    deletePlaylist
}