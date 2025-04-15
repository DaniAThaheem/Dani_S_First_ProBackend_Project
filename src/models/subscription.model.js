import mongoose, {Schema} from "mongoose";


const subscriptionSchema = new Schema(
    {
        //Channel that subscribed me
        channel:{
            type: Schema.Types.ObjectId,
            ref: "User"
        },

        //Channel to whom I am subscriber of
        subscriber:{
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps:true
    }

)

export const Subscription = mongoose.model("Subscription", subscriptionSchema)