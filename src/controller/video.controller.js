import mongoose from "mongoose";
import { Video } from "../models/video.models.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { deleteFileToCloudinary, getPublicIdFormUrl, uploadFileToCloudinary } from "../utils/cloudinary.js";
import { AppResponse } from "../utils/AppResponse.js";

const postVideo = asyncHandler(async(req, res, next)=>{
    try {
        const videoOwnerId = req.user?._id;
        const videoLocalPath = req.files?.['videoFile']?.[0]?.path;
        const thumbnailLocalPath = req.files?.['thumbnailImage']?.[0]?.path
        const { title, description } = req.body; 
    
        if(!videoOwnerId){
            throw new AppError(401, "unauthorised access.");
        }
        if(!(videoLocalPath?.trim() && thumbnailLocalPath?.trim())){
            throw new AppError(400, "video and thumbnail is required.")
        }
        if(!(title?.trim() && description?.trim())){
            throw new AppError(400, "title and description is required.")
        }
    
        const [cloudinaryResponseForVideo,cloudinaryResponseForThumbnail] = await Promise.all([uploadFileToCloudinary(videoLocalPath),uploadFileToCloudinary(thumbnailLocalPath)])
        
        const videoFile = cloudinaryResponseForVideo.secure_url;
        const duration = cloudinaryResponseForVideo.duration;
        const thumbnail = cloudinaryResponseForThumbnail.secure_url;
    
        if(!(videoFile && duration && thumbnail)){
            throw new AppError(500);
        }
    
        const video = await Video.create({
            owner: new mongoose.Types.ObjectId(videoOwnerId),
            videoFile,
            thumbnail,
            title,
            description,
            duration,
        })
    
        await video.save();
    
        res.status(200)
        .json(new AppResponse(200, video, "video is uploaded successfully."))

    } catch (error) {
        throw new AppError(error.statusCode || 500, error?.message)
    }

})

const updateVideoInfo = asyncHandler(async(req, res, next)=>{
    try {
        const { title, description, isPublished, videoId } = req.body;
        if(!(title?.trim() || !description?.trim() || isPublished!== undefined)){
            throw new AppError(400, "title, description and isPublished is not present")
        }
    
        let propertyToBeSet = {};
        if(title){
            propertyToBeSet.title = title;
        }
        if(description){
            propertyToBeSet.description = description;
        }
        if(isPublished !== undefined){
            propertyToBeSet.isPublished = isPublished;
        }
    
        const video = await Video.findByIdAndUpdate(
            videoId,
            { $set: { ...propertyToBeSet } },
            { new: true }
        );

        res.status(200)
        .json(new AppResponse(200, video, " video Info is updated successfully"));
    
    } catch (error) {
        throw new AppError(error.statusCode || 500, error.message);
    }
})

const increaseViewCount = asyncHandler(async(req, res, next)=>{
    try {
        const { videoId } = req.body;
        if(!videoId){
            throw new AppError(400, "videoId is mandatory.");
        }
    
        const video = await Video.findById(videoId);
        await video.increaseViewCount();

        res.status(200).json(new AppResponse(200,{},"view is increased by one"))
    } catch (error) {
        throw new AppError(error.statusCode || 500, error.message);
    }
})

const searchVideoByText = asyncHandler(async(req, res, next)=>{
    try {
        const { searchText } = req.body;
        if(!searchText?.trim()){
            throw new AppError(400, 'There is no seachText.')
        }
        const videoList = await Video.find({
            $or: [
                { title: { $regex: searchText, $options: 'i' } }, // Case-insensitive regex match for title
                { description: { $regex: searchText, $options: 'i' } } // Case-insensitive regex match for description
            ]
        });
        res.status(200)
        .json(new AppResponse(200, videoList));
    } catch (error) {
        throw new AppError(error.statusCode || 500, error.message);
    }
})

const editThumbnail = asyncHandler(async(req, res, next)=>{
    try {
        const { videoId } = req.body;
        const thumbnailLocalPath = req.files?.['thumbnailImage']?.[0]?.path;
        if(!videoId || !thumbnailLocalPath){
            throw new AppError(400, 'videoId and thumbnailImage is mandatory')
        }
        const cloudinaryResponse = await uploadFileToCloudinary(thumbnailLocalPath);
        const video = await Video.findById(videoId);
        await deleteFileToCloudinary(video.thumbnail);
        video.thumbnail = cloudinaryResponse.secure_url;
        await video.save({validateBeforeSave: false})
    
        res.status(200)
        .json(new AppResponse(200, video, "Thumbnail is updated successfully."))
    } catch (error) {
        throw new AppError(error.statusCode || 500, error.message);
    }
})

export {
    postVideo,
    updateVideoInfo,
    increaseViewCount,
    searchVideoByText,
    editThumbnail,
}