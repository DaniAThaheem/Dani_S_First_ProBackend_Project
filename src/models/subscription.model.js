import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const subscriptionSchema = new Schema(
    {
        //Channel that subscribed me
        channel:{
            type: Schema.Types.ObjectId,
            ref: "User",
            required:true
        },

        //Channel to whom I am subscriber of
        subscriber:{
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps:true
    }

)
subscriptionSchema.plugin(mongooseAggregatePaginate)
export const Subscription = mongoose.model("Subscription", subscriptionSchema)