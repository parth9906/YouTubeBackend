import { Types } from "mongoose";
import { Comment } from "../models/comment.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppResponse } from '../utils/AppResponse.js'
import { AppError } from "../utils/AppError.js"

const postCommentOnVideo = asyncHandler(async(req, res, next)=>{
    try {
        const userID = req.user?._id;
        const { content, videoId } = req.body;

        const comment = await Comment.create({
            owner: new Types.ObjectId(userID),
            video: new Types.ObjectId(videoId),
            content
        })
    
        res.status(200)
        .json(new AppResponse(200, comment, "comment is posted successfully."))
    } catch (error) {
        throw new AppError(error.statusCode || 500, error.message);
    }
})

const editCommentOnVideo = asyncHandler(async(req, res, next)=>{
    try {
        const { commentId, newContent } = req.body;
        const userId = req.user?._id;
        const comment = await Comment.findOne({
            _id: new Types.ObjectId(commentId),
            owner: new Types.ObjectId(userId)
        });
        
        if(!comment){
            throw new AppError(403, "You are not authorised to edit this comment.")
        }
    
        const newComment = await Comment.findByIdAndUpdate(commentId,
            {
                $set: { content: newContent }
            },
            { new: true }
        )
    
        res.status(200)
        .json(new AppResponse(200, newComment,"Comment is updated successfully."));
    } catch (error) {
        throw new AppError(error.statusCode || 500, error.message);
    }
})

const deleteCommentOnVideo = asyncHandler(async(req, res, next)=>{
    try {
        const { commentId } = req.body;
        const userId = req.user?._id;
        const comment = await Comment.findOne({
            _id: new Types.ObjectId(commentId),
            owner: new Types.ObjectId(userId)
        });
        
        if(!comment){
            throw new AppError(403, "You are not authorised to delete this comment.")
        }
        await Comment.findByIdAndRemove(commentId);
    
        res.status(200)
        .json(new AppResponse(200, {},"Comment is deleted successfully."));
    } catch (error) {
        throw new AppError(error.statusCode || 500, error.message);
    }
})

export {
    postCommentOnVideo,
    editCommentOnVideo,
    deleteCommentOnVideo,
}

