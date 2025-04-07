import { v2 as cloudinary } from 'cloudinary';
import dotenv from "dotenv";
dotenv.config({path: '../env'})
import fs from 'fs'

    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_SECRET
    });
const cloudinaryDestroy = async function name(params) {
    
}

export {cloudinaryDestroy}
