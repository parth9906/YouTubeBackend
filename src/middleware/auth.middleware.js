import { User } from "../models/user.models.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";


export const varifyToken = asyncHandler(async(req, res, next)=>{
    try {
        const accesToken = req.cookie?.accesToken || req.header('Authorization')?.replace('Bearer ',"");
        if(!accesToken){
            throw new AppError(401, "Invalid access token");
        }
        const decoded = await jwt.verify(accesToken, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decoded?._id).select('-password -refreshToken');
        if(!user){
            throw new AppError(401, "Invalid access token");
        }
        req.user = user;
        next();
    } catch (error) {
        throw new AppError(401, "Invalid access token",error);
    }
})