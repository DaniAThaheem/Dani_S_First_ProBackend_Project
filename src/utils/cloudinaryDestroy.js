import { v2 as cloudinary } from 'cloudinary';
import dotenv from "dotenv";
dotenv.config({path: '../env'})

    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_SECRET
    });

    // Get public id of the file using the file url
const getPublicID = function(url){

    //split method break the string into array and [1] ask to get second element
    const importantPathofUrl = url.split('/upload/')[1]
    //you got the version and folder with file name and extension
    //split method split the array into three parts version folder and file name.. slice(1) will keep everything in array from the index 1 to onwards... join("/") join the array into the string using the /
    const filePath = importantPathofUrl.split('/').slice(1).join('/')
    // when we will remove the extension of the file the remaining folder and file name is the public key...using the strig methods to remove the extension instead of regex....lastIndexOf method checks the last index of the given character.. 
    const dotIndex = filePath.lastIndexOf(".")
    //using the ternery operatory to get the substring from the index of 0 to just before the index of the dot if dot does not exist then take the filePath as a public id
    const publicId = dotIndex!==-1? filePath.subString(0, dotIndex):  filePath
    return publicId

}
const cloudinaryDestroy = async function(fileURL) {

    try {
        const publicId = getPublicID(fileURL)
        const result = await cloudinary.uploader.destroy(publicId)
        return result.result === 'ok'  
    } catch (error) {
        console.error("Error while removing file in cloudinary", error)
        return false
    }
    
}

export {cloudinaryDestroy}
