import { v2 as cloudinary } from "cloudinary";
import fs from 'fs'
import { AppError } from "./AppError.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const getPublicIdFormUrl = (url) => {
    return url?.split('/')?.slice(-1)?.[0]?.split('.')?.[0];
}

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

const deleteFileToCloudinary = async (url) => {
    const resourcePublicKey = getPublicIdFormUrl(url)
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


/**  response of image Uploading 
 {
    asset_id: 'c1275f0f14f5ca8a71a6de27a1028701',
    public_id: 'hvxna0cqrqy5zdayeodg',
    version: 1715355977,
    version_id: '79a50369cb728b631fd6ca406a597e1e',
    signature: '1bafcb31541fdb69327543920dfbc695647b706c',
    width: 5472,
    height: 3648,
    format: 'jpg',
    resource_type: 'image',
    created_at: '2024-05-10T15:46:17Z',
    tags: [],
    bytes: 4274974,
    type: 'upload',
    etag: '33744ede1624cbbeca358277da5c0750',
    placeholder: false,
    url: 'http://res.cloudinary.com/parth-youtubebackend/image/upload/v1715355977/hvxna0cqrqy5zdayeodg.jpg',
    secure_url: 'https://res.cloudinary.com/parth-youtubebackend/image/upload/v1715355977/hvxna0cqrqy5zdayeodg.jpg',
    folder: '',
    original_filename: 'coverImage',
    api_key: '555478339268224'
    }
*/

/** response for image deletion 
    { result: 'ok' }
*/

// response of video Uploading
/**
 * cloudinaryResponseForVideo": {
    "asset_id": "17f77b8d524f03bd2cccd854a4883b9b",
    "public_id": "w5dzhuicfvvxz2rdwwui",
    "version": 1715438931,
    "version_id": "f965b29668e0cdf99c0aae412c1beb9b",
    "signature": "1f58ba6d219514607558aafeccaa976a2dc506c0",
    "width": 1280,
    "height": 720,
    "format": "mp4",
    "resource_type": "video",
    "created_at": "2024-05-11T14:48:51Z",
    "tags": [],
    "pages": 0,
    "bytes": 2107842,
    "type": "upload",
    "etag": "6cff9004d995b5c929ce90e391100996",
    "placeholder": false,
    "url": "http://res.cloudinary.com/parth-youtubebackend/video/upload/v1715438931/w5dzhuicfvvxz2rdwwui.mp4",
    "secure_url": "https://res.cloudinary.com/parth-youtubebackend/video/upload/v1715438931/w5dzhuicfvvxz2rdwwui.mp4",
    "playback_url": "https://res.cloudinary.com/parth-youtubebackend/video/upload/sp_auto/v1715438931/w5dzhuicfvvxz2rdwwui.m3u8",
    "folder": "",
    "audio": {
        "codec": "aac",
        "bit_rate": "381988",
        "frequency": 48000,
        "channels": 6,
        "channel_layout": "5.1"
    },
    "video": {
        "pix_format": "yuv420p",
        "codec": "h264",
        "level": 31,
        "profile": "Main",
        "bit_rate": "862991",
        "dar": "16:9",
        "time_base": "1/12800"
    },
    "is_audio": false,
    "frame_rate": 25,
    "bit_rate": 1248721,
    "duration": 13.504,
    "rotation": 0,
    "original_filename": "SampleVideo_1280x720_2mb",
    "nb_frames": 337,
    "api_key": "555478339268224"
},
    */
