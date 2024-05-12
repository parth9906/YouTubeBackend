import mongoose, { Schema } from "mongoose";

const likeSchema = new Schema({
    comment:{
        type: Schema.Types.ObjectId,
        ref: 'Comment',
    },
    video:{
        type: Schema.Types.ObjectId,
        ref: 'Video',
        required: true,
    },
    likedBy:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
},{timestamps: true});


export const Like = mongoose.model('Like', likeSchema);