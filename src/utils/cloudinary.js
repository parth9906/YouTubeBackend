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
        // response === {
        //     asset_id: 'c1275f0f14f5ca8a71a6de27a1028701',
        //     public_id: 'hvxna0cqrqy5zdayeodg',
        //     version: 1715355977,
        //     version_id: '79a50369cb728b631fd6ca406a597e1e',
        //     signature: '1bafcb31541fdb69327543920dfbc695647b706c',
        //     width: 5472,
        //     height: 3648,
        //     format: 'jpg',
        //     resource_type: 'image',
        //     created_at: '2024-05-10T15:46:17Z',
        //     tags: [],
        //     bytes: 4274974,
        //     type: 'upload',
        //     etag: '33744ede1624cbbeca358277da5c0750',
        //     placeholder: false,
        //     url: 'http://res.cloudinary.com/parth-youtubebackend/image/upload/v1715355977/hvxna0cqrqy5zdayeodg.jpg',
        //     secure_url: 'https://res.cloudinary.com/parth-youtubebackend/image/upload/v1715355977/hvxna0cqrqy5zdayeodg.jpg',
        //     folder: '',
        //     original_filename: 'coverImage',
        //     api_key: '555478339268224'
        //   }
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
        // response === { result: 'ok' }
        return response;
    } catch (error) {
        throw new AppError(500, "Something went wrong while removing the resouce form cloudinary.");
    }
    
}

export { 
    uploadFileToCloudinary, 
    deleteFileToCloudinary,  
};
