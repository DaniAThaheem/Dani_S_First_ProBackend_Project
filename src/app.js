import express from "express"
import cors from "cors"
import dotenv from "dotenv";
dotenv.config({path: '../env'})
import cookieParser from "cookie-parser"
import userRouter from "./routes/user.routes.js"
import subscriptionRouter from "./routes/subscription.routes.js"
import videoRouter from "./routes/video.routes.js"

const app = express()


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

app.use(express.static("public"))

app.use(cookieParser())





app.use("/api/v1/user", userRouter)
app.use("/api/v1/video", videoRouter)

app.use("/api/v1/subscription", subscriptionRouter)