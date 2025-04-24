import express from "express"
import cors from "cors"
import dotenv from "dotenv";
dotenv.config({path: '../env'})
import cookieParser from "cookie-parser"
import userRouter from "./routes/user.routes.js"
import subscriptionRouter from "./routes/subscription.routes.js"
import videoRouter from "./routes/video.routes.js"
import tweetRouter from "./routes/tweet.routes.js"
import playlistRouter from "./routes/playlist.routes.js"
import likeRouter from "./routes/like.routes.js"
import healthcheckRouter from "./routes/healthcheck.routes.js"
import dashboardRouter from "./routes/dashboard.routes.js"
import commentRouter from "./routes/comment.routes.js"

const app = express()

//for testing
app.get("/", (req, res)=>{
    res.send("api is running...")
})


//for testing
// app.use((err, req, res, next)=>{
//     console.error(err.stack);
//     res.status(500).json({
//         error: "Internal serverr error",
//         details: err.message
//     })
// })
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    cridentials: true
}))

app.use(express.json(
    {
        limit: "16kb"
    }
))

app.use(express.urlencoded(
    {
        extended: true,
        limit: "16kb"
    }
))
app.use(cookieParser())

app.use(express.static("public"))






app.use("/api/v1/users", userRouter)
//for testing
app.use("/api/v1/video", videoRouter)

app.use("/api/v1/subscription", subscriptionRouter)
app.use((req, res)=>{
    res.status(404).json({message:"route not found"})
})
app.use("/api/v1/tweet", tweetRouter)
app.use("/api/v1/playlist", playlistRouter)
app.use("/api/v1/like", likeRouter)
app.use("/api/v1/healthcheck", healthcheckRouter)
app.use("/api/v1/dashboardRouter", dashboardRouter)
app.use("/api/v1/comment", commentRouter)


export { app }