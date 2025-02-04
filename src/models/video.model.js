import mongoose, {Schema} from "mongoose";



const videoSchema = new Schema(
    {
        videofile:{
            type: String, //Cloudinary Link
            required: true
        },
        thumbnail:{
            type: String
        },
        owner:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        title:{
            type: String,
            required: true
        },
        description:{
            type: String,
            required: true
        },
        duration:{
            type: Number,
            required: true
        },
        views:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            }
        ],
        isPublic:{
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
)

export const Video = mongoose.model("Video", videoSchema)