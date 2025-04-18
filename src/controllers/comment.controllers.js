import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const getVideoComment = asyncHandler(async(req, res)=>{

    const { videoID } = req.params
    const { page = 1, limit =  10} = req.query

    const comments = await Comment.find(
        {
            video:videoID
        }
    )
    .skip((page-1)*limit)
    .limit(limit)
})
const addComment = asyncHandler(async(req, res)=>{
    const {videoID} = req.params
    const {content} = req.body
    const {userID} = req.user?._id

    if(!content){
        throw new ApiError(400, "Content of the comment is required")
    }

    const comment = await Comment.create(
        {
            content,
            video:videoID,
            owner:userID
        }
    )

    if(!comment){
        throw new ApiError(500, "Could not post comment")
    }

    return res
    .statusCode(200)
    .json(
        new ApiResponse(
            200,
            comment,
            "Comment posted succssfully"
        )
    )
})

const updateComment = asyncHandler(async(req, res)=>{
    const {commentID} = req.params
    const {content} = req.body
    
    const updatedComment = await Comment.findByIdAndUpdate(
        {commentID},
        {
            $set:{
                content
            }
        },
        {
            new: true
        }
    )
    if(!updatedComment){
        throw new ApiError(500, "Could not update comment")
    }

    return res
    .statusCode(200)
    .json(
        new ApiResponse(
            200,
            updatedComment,
            "Comment updated successfully"
        )
    )
})

const deleteComment = asyncHandler(async(req, res)=>{
    const {commentID} = req.params
    
    const deletedComment = await Comment.findByIdAndDelete(commentID)

    if(!deletedComment){
        throw new ApiError(500, "Could not delete comment")
    }
    return res
    .statusCode(203)
    .json(
        new ApiResponse(
            203,
            null,
            "Comment deleted successfully"   
        )
    )
})

export{
    getVideoComment,
    addComment,
    updateComment,
    deleteComment
}