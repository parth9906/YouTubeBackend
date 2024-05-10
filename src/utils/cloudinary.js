import { v2 as cloudinary } from "cloudinary";
import fs from 'fs'
import { AppError } from "./AppError.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadFileToCloudinary = async (localFilePath) => {
    if(!localFilePath) return null;

    try {
        const response = await cloudinary.uploader.upload( localFilePath, { resource_type: "auto" });
        console.info("file is uploaded successfully to the cloudinary")
        return response;
    } catch (error) {
        console.error("Oops!! there is an error during uploading the file to cloudinary")
    } finally {
        fs.unlinkSync(localFilePath,(err)=>{
            if(!err){
                console.info("file removed successfully form temp dir in the server")
            }else{
                console.error("file removal failed from temp directory in the server: ",err)
            }
        });
    }
    return null;
};

const deleteFileToCloudinary = async (resourcePublicKey) => {
    if(!resourcePublicKey){
        throw new AppError(500, "Resource Public key is required.");
    }
    try {
        const response = await cloudinary.uploader.destroy(resourcePublicKey);
        return response;
    } catch (error) {
        throw new AppError(500, "Something went wrong while removing the resouce form cloudinary.");
    }
    
}

export { 
    uploadFileToCloudinary, 
    deleteFileToCloudinary,  
};
