import mongoose, { Schema } from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

const VideoSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    videoFile: {
        type: String, // cloudinery url
        required: true,
    },
    thumbnail: {
        type: String, // cloudinery url
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String, 
        required: true,
    },
    duration: {
        type: Number, 
        required: true,
    },
    views: {
        type: Number, 
        default: 0,
    },
    isPublished: {
        type: Boolean,
        default: true,
    },
},{ timestamps: true })

VideoSchema.methods.increaseViewCount = function (viewsToBeIncreased = 1){
    this.views = this.views + viewsToBeIncreased;
    return this.save();
}

VideoSchema.plugin(aggregatePaginate);

export const Video = mongoose.model('Video', VideoSchema);