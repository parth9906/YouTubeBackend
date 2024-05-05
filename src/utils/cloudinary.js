import { v2 as cloudinary } from "cloudinary";
import fs from 'fs'

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

export { uploadFileToCloudinary };
