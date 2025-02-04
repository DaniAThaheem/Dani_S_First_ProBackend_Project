import { v2 as cloudinary } from 'cloudinary';
import { log } from 'console';
import dotenv from "dotenv";
dotenv.config({path: '../env'})
import fs from 'fs'

    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_SECRET
    });

    const cloudinaryUpload = async function(localUrl){
        try {
            if(!localUrl)
                return null;
            const response = await cloudinary.uploader.upload(
                localUrl,
                {
                    resource_type: "auto"
                }
            )
            console.log(`File uploaded success fully ${response}`);
            return response
            
        } catch (error) {
            fs.unlinkSync(localUrl)
            return null
        }
    }


















    // // Upload an image
    //  const uploadResult = await cloudinary.uploader
    //    .upload(
    //        'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
    //            public_id: 'shoes',
    //        }
    //    )
    //    .catch((error) => {
    //        console.log(error);
    //    });
    
    // console.log(uploadResult);
    
    // // Optimize delivery by resizing and applying auto-format and auto-quality
    // const optimizeUrl = cloudinary.url('shoes', {
    //     fetch_format: 'auto',
    //     quality: 'auto'
    // });
    
    // console.log(optimizeUrl);
    
    // // Transform the image: auto-crop to square aspect_ratio
    // const autoCropUrl = cloudinary.url('shoes', {
    //     crop: 'auto',
    //     gravity: 'auto',
    //     width: 500,
    //     height: 500,
    // });
    
    // console.log(autoCropUrl);    