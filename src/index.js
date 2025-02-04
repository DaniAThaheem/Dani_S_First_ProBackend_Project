import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";
dotenv.config({path: '../env'})
import {DB_NAME} from "./constants.js"
import {DBConnection} from "./db/index.js";
const app = express()
// import DBConnection from "./db/index.js";



const port = process.env.PORT

DBConnection()
.then(
    ()=>{
        app.on("error", (error)=>{
            console.log(`Error: ${error}`);
            
        })
        app.listen(port, ()=>{
            console.log(`THE APP IS LISTENING ON PORT ${port}`);
        })
    }
)
.catch(
    (error)=>{
        console.error(`Error: ${error}`);
        
    }
)





























// const app = express();

//     const Port =process.env.PORT || 3002

// ;(async()=>{
//     try {
//         const connectionInstance = await mongoose.connect(process.env.DB_URI)
//         console.log(connectionInstance.connection.host + " Database connected");
        
//         // app.on(error, ()=>{
//         //     console.error("Erorr:", error)
//         // })
//         app.listen(Port,()=>{
//             console.log(`Application is running at ${Port}`);
            
//         })
        
//     } catch (error) {
//         console.error("Error:", error);
//         throw error
//         process.exit(1)
        
        
//     }
// })()

