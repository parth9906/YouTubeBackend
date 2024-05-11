import mongoose, { Schema, Types } from "mongoose";

const subscriptionSchema = Schema({
    channel: {
        type: Schema.Types.ObjectId,
        ref: "User",
        index: true,
    },
    subscriber: {
        type: Schema.Types.ObjectId,
        ref: "User",
        index: true,
    }
},{ timestamps: true})

export const Subscription = mongoose.model('Subscription', subscriptionSchema);