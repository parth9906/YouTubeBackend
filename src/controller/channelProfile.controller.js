import mongoose from "mongoose";
import { Subscription } from "../models/subscription.models.js";
import { User } from "../models/user.models.js";
import { AppError } from "../utils/AppError.js";
import { AppResponse } from "../utils/AppResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js";


const getChannelProfileData = asyncHandler(async(req, res, next)=>{
    try {
        const { username } = req.params;
        if(!username || !username?.trim()){
            throw new AppError(400, "username is mandatry.")
        }
    
        const channelProfile = await User.aggregate()
        .match({ username : username?.toLowerCase() })
        .lookup({
            from: 'subscriptions',
            localField: '_id',
            foreignField: 'channel',
            as: 'subscribers'
        })
        .lookup({
            from: 'subscriptions',
            localField: '_id',
            foreignField: 'subscriber',
            as: 'subscribedToChannel'
        })
        .addFields({
            "subscribersCount": { $size: '$subscribers'},
            'subscribedTo': { $size : '$subscribedToChannel'},
            'isSubscribed': {
                $cond: {
                    if: { $in : [ req.user._id, '$subscribers.subscriber'] }, // Condition
                    then: true, // Value if true
                    else: false // Value if false
                }
            }
        })
        .project({
            '_id': 0,
            'username': 1,
            'fullName': 1,
            'email': 1,
            'avatar': 1,
            'coverImage': 1,
            'createdAt': 1,
            'updatedAt': 1,
            'subscribersCount': 1,
            'subscribedTo': 1,
            'isSubscribed': 1,
        })
    
        if(channelProfile?.length === 0){
            throw new AppError(404, "channel not found.")
        }
    
        res.status(200)
        .json(new AppResponse(200, channelProfile[0]))
    } catch (error) {
        throw new AppError(error?.statusCode || 500, error?.message)
    }

})

const subscribedToChannel = asyncHandler(async(req, res, next)=>{
    try {
        const  subscriberId  = req.user?._id;
        const { channel } = req.body;

        if(!channel || !subscriberId){
            throw new AppError(400, "channel and subscriber fields are mandatory.");
        }

        const channelObj = await User.findOne({username: channel});
        const channelId = channelObj?._id
        if(!channelId){
            throw new AppError(404, "channel not found");
        }


        const subscription = await Subscription.findOne({
            channel: new mongoose.Types.ObjectId(channelId),
            subscriber: new mongoose.Types.ObjectId(subscriberId),
        })

        if(!subscription){
            const sub = await Subscription.create({
                channel: new mongoose.Types.ObjectId(channelId),
                subscriber: new mongoose.Types.ObjectId(subscriberId),
            })
            await sub.save();

            res.status(200)
            .json(new AppResponse(200,{}, 'user is subscribed successfully.'))
        } else{

            res.status(200)
            .json(new AppResponse(200,{}, 'user is already subscribed.'))
        }

    } catch (error) {
        throw new AppError(400, error?.message);
    }
})

const unSubscribedToChannel = asyncHandler(async(req, res, next)=>{
    try {
        const  subscriberId  = req.user?._id;
        const { channel } = req.body;

        if(!channel || !subscriberId){
            throw new AppError(400, "channel and subscriber fields are mandatory.");
        }

        const channelObj = await User.findOne({username: channel});

        const channelId = channelObj?._id
        if(!channelId){
            throw new AppError(404, "channel not found");
        }

        const deletedSubscription = await Subscription.findOneAndDelete({
            channel: new mongoose.Types.ObjectId(channelId),
            subscriber: new mongoose.Types.ObjectId(subscriberId)
        });

        if(deletedSubscription){
            res.status(200)
            .json(new AppResponse(200, {},'user is Unsubscribed successfully.'))
        } else {
            res.status(200)
            .json(new AppResponse(200, {},'user is already Unsubscribed.'))
        }
        
       
    } catch (error) {
        throw new AppError(400, error?.message);
    }
})

const getChannleVideos = asyncHandler(async(req, res, next)=>{
    try {
        const { username } = req.params;

        if(!username || !username?.trim()){
            throw new AppError(400, 'username is required')
        }
    
        const videosList = await User.aggregate()
        .match({ username })
        .project({_id: 1})
        .lookup({
            from: 'videos',
            localField: '_id',
            foreignField: 'owner',
            as: 'video',
    
            pipeline:[
                {
                    $match: { 'isPublished': true }
                },
                {
                    $project: {
                        'videoFile': 1,
                        'thumbnail': 1,
                        'title': 1,
                        'description': 1,
                        'duration': 1,
                        'views': 1,
                        'createdAt': 1,
                    }
                }
            ]
        })
        .unwind({ 'path': '$video', preserveNullAndEmptyArrays: false })
    
        if(videosList.length === 0){
            throw new AppError(404, "No video found.");
        }
        res.status(200)
        .json(new AppResponse(200, videosList));

    } catch (error) {
        throw new AppError(error.statusCode || 500, error.message);
    }
})

export {
    getChannelProfileData,
    subscribedToChannel,
    unSubscribedToChannel,
    getChannleVideos
}