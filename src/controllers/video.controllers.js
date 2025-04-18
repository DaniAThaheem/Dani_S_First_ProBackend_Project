import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {asyncHandler} from "../utils/asyncHandler.js"
import { cloudinaryDestroy } from "../utils/cloudinaryDestroy.js";
import { cloudinaryUpload } from "../utils/cloudinaryUpload.js";

//Logic 3: Get all videos
const getAllVideos = asyncHandler(async(req, res)=>{
    const {page=1, limit=10, query, sortBy, sortType, userID} = req.query

    // When you want to use the already decleared varialbe as a key in the object you have to use [] otherwise it will be decleared as a key literal

    const sortOrder = { [sortBy] : sortType === "asc"? 1:-1}
    const videos = await Video.find(
        {
            owner:userID,
            title:{
                $regex: query,
                $options:'i'
            }
        }
       
    )
    .sort(sortOrder)
     //Formula to skip video viewed in previous page
    .skip((page-1)*limit)
    .limit(limit)

    if(!videos){
        throw new ApiError(500, "Could not get videos")
    }
    return res
    .statusCode(200)
    .json(
        new ApiResponse(
            200,
            videos,
            "fetched all videos successfully"
        )
    )
})


// Logic 2: Publishing a video
const publishAVideo = asyncHandler( async(req, res)=>{
    //Get user id
    const owner = req.user._id;
    //Get other fileds
    const {title, description, isPublic } = req.body;
    // Get local path
    const vidosUrl = req.files?.video[0]?.path;
    const thumbnailUrl = req.files?.thumbnail[0]?.path;

    // Validate

    if(!(vidosUrl || thumbnailUrl)){
        throw new ApiError(
            400,
            "Either video or thumbnail is missing"
        )
    }

    // Upload on cloudinary

    const videoObj = await cloudinaryUpload(vidosUrl)
    const thumbnailObj = await cloudinaryUpload(thumbnailUrl)

    // Validation after uploading on cloudinary

    if( !videoObj){
        throw new ApiError( 500, "Error while uploading video")
    }
    if( !thumbnailObj){
        throw new ApiError( 500, "Error while uploading thumbnail")
    }


    //Creating object in mongodb    
    const video = await Video.create(
        {
            videofile: videoObj.url,
            thumbnail: thumbnailObj.url,
            owner,
            title,
            description,
            duration: videoObj.duration,
            isPublic
        }
    )

    // validation after creating object

    if(!video){
        throw new ApiError( 500, "Could not publish vido")
    }
    // Sending response
    return res
    .statusCode(201)
    .json(
        new ApiResponse(
            201,
            video,
            "Video published success fully"
        )
    )

}
)

// Logic 3: Get video by id

const getVideoById = asyncHandler( async (req, res) => {

    const {videoID} = req.params;

    if(!videoID){
        throw new ApiError(400, "Could not Get Id")
    }

    const video = await Video.findById(videoID)

    if(!video){
        throw new ApiError(404, "Could not find video")
    }

    return res
    .statusCode(201)
    .json(
        new ApiResponse(
            201,
            video,
            "Found required vido"
        )
    )
})

//Logic 4: Update video details

const updateVideo = asyncHandler( async( req, res)=>{
    const {videoID} = req.params;
    const {title, description} = req.body
    const thumbnailUrl = req.file

    if(!thumbnailUrl){
        throw new ApiError(400, "Could not get thumbnail url")
    }



    const oldVideoObj = await Video.findById(videoID)

    const result = await cloudinaryDestroy(oldVideoObj.thumbnail)

    if( result !=='ok'){
        throw new ApiError(500, "Could not remove existing thumbnail")
    }

    const thumbObj = await cloudinaryUpload(thumbnailUrl)
    
    const newVideoObj = await Video.findByIdAndUpdate(
        videoID,
        {
            $set:{
                title,
                description,
                thumbnail: thumbObj.url
            }
        },
        {
            new: true
        }

    )

    if(!newVideoObj){
        throw new ApiError(500, "Could not make updation")
    }

    return res
    .statusCode(200)
    .json(
        new ApiResponse(
            200,
            newVideoObj,
            "Updation made successfully"
        )
    )
})

//Logic 5: Delete Video

const deleteVideo = asyncHandler( async( req, res)=>{
    const {videoID} = req.params

    const oldVideoObj = await Video.findById( videoID )

    const videoDestroyResult = await cloudinaryDestroy(oldVideoObj.videofile)

    const thumbnailDestroyResult = await cloudinaryDestroy(oldVideoObj.thumbnail)

    if(videoDestroyResult !== "ok" || thumbnailDestroyResult !== "ok"){
        throw new ApiError( 500, "Eitherr video or thumbnail is not deleted")
    }

    const result = await Video.findByIdAndDelete(videoID)

    if(!result){
        throw new ApiError(500, "Could not delete video from data base")
    }

    return res
    .statusCode(204)
    .json(
        new ApiResponse(
            204,
            null,
            "Video deleted successfullly"
        )
    )
})

//Logic 6: Toggle Publish Status

const togglePublishStatus = asyncHandler( async(req, res)=>{
    const {videoID} = req.params
    const oldVideoObj = await Video.findById(videoID)
    if(!oldVideoObj){
        throw new ApiError(400,  "Could  not find Video")
    }
    const newVideoObj = await Video.findByIdAndUpdate(videoID,
        {
            isPublic : !oldVideoObj.isPublic
            
        }
    )
    if(!newVideoObj){
        throw new ApiError(500,  "Could  not make toggle updation")
    }

    
    // video.isPublic = video.isPublic? false: true
    // await video.save({isNew:false})
    return res
    .statusCode(200)
    .json(
        new ApiResponse(
            200,
            newVideoObj,
            "Publish Status Toggled"
        )
    )
})



export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}