import mongoose, { Schema } from "mongoose";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
const saltRounds = 10;

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, 'username is required'],
        unique: true,
        lowerCase: true,
        trim: true,
        index: true
    },
    fullName: {
        type: String,
        required: [true, 'fullname is required'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'email is required'],
        unique: true,
        lowerCase: true,
        trim: true,
        index:true,
    },
    password :{
        type: String,
        required: [true, 'Password is required'],
        trim: true,
    },
    avatar :{
        type: String, // cloudinery url
    },
    coverImage :{
        type: String, // cloudinery url
    },
    refreshToken :{
        type: String,
    },
    watchHistory: [
        {
            type: Schema.Types.ObjectId,
            ref:'Video'
        }
    ],
    roles:[{
        type:String
    }]

}, { timestamps: true });


userSchema.pre('save',async function(next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, saltRounds);
    }
    next();
})

userSchema.methods.isPasswordCorrect = async function( password ){
    return await bcrypt.compare( password, this.password );
}

userSchema.methods.generateAccessToken = async function(){
    return await jwt.sign(
        {
            _id: this._id,
            username: this.username,
            email: this.email,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = async function(){
    return await jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}




export const User = mongoose.model('User', userSchema);