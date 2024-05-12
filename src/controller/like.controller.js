import { Types } from "mongoose";
import { Like } from "../models/like.models.js";
import { asyncHandler } from "../utils/asyncHandler.js"
import { AppError } from "../utils/AppError.js";
import { AppResponse } from "../utils/AppResponse.js";

const likeComment = asyncHandler(async(req, res, next)=>{
    try {
        const userID = req.user?._id;
        const { commentId } = req.body;
        if(!commentId){
            throw new AppError(400, "comment id is madatory.");
        }
    
        const like = await Like.create({
            likedBy: new Types.ObjectId(userID),
            comment: new Types.ObjectId(commentId)
        })
        res.status(200)
        .json(new AppResponse(200, like, "Comment liked successfully."))
    
    } catch (error) {
        throw new AppError(error.statusCode || 500, error.message);
    }
})

const unlikeComment = asyncHandler(async(req, res, next)=>{
    try {
        const userID = req.user?._id;
        const { likeId, commentId } = req.body;
    
        const like = await Like.findOne({
            likedBy: new Types.ObjectId(userID),
            comment: new Types.ObjectId(commentId),
            _id: new Types.ObjectId(likeId)
        })
        if(!like){
            throw new AppError(400, "No like by user in this comment.");
        }
        await Like.findByIdAndDelete(likeId);
    
        res.status(200)
        .json(new AppResponse(200, {}, "Comment is unliked successfully"));
    
    } catch (error) {
        throw new AppError(error.statusCode || 500, error.message);
    }})

const likeVideo = asyncHandler(async(req, res, next)=>{
    try {
        const userID = req.user?._id;
        const { videoId } = req.body;
        if(!videoId){
            throw new AppError(400, "Video id is madatory.");
        }
    
        const like = await Like.create({
            likedBy: new Types.ObjectId(userID),
            video: new Types.ObjectId(videoId)
        })
        res.status(200)
        .json(new AppResponse(200, like, "Video liked successfully."))
    
    } catch (error) {
        throw new AppError(error.statusCode || 500, error.message);
    }
})

const unlikeVideo = asyncHandler(async(req, res, next)=>{
    try {
        const userID = req.user?._id;
        const { likeId, videoId } = req.body;
    
        const like = await Like.findOne({
            likedBy: new Types.ObjectId(userID),
            video: new Types.ObjectId(videoId),
            _id: new Types.ObjectId(likeId)
        })
        if(!like){
            throw new AppError(400, "No like by user in this video.");
        }
        await Like.findByIdAndDelete(likeId);
    
        res.status(200)
        .json(new AppResponse(200, {}, "Comment is unliked successfully"));
    
    } catch (error) {
        throw new AppError(error.statusCode || 500, error.message);
    }
})

export {
    likeComment,
    unlikeComment,
    likeVideo,
    unlikeVideo,
}