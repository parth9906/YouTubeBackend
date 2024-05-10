import jwt from "jsonwebtoken";
import { asyncHandler } from '../utils/asyncHandler.js'
import { AppError } from '../utils/AppError.js';
import { AppResponse } from '../utils/AppResponse.js'
import { User } from '../models/user.models.js';
import { deleteFileToCloudinary, uploadFileToCloudinary } from '../utils/cloudinary.js';

const cookieOption = {
    httpOnly: true,
    secure: true,
}

const generateAccessAndRefreshToken = async(userId) => {
    try {
        const user = await User.findById(userId);
        const [accessToken, refreshToken] = await Promise.all([user.generateAccessToken(), user.generateRefreshToken()])
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false});
        return {accessToken, refreshToken};
    
    } catch(error){
        throw new AppError(500, "Something went wrong while genrating token.");
    }
}


const registerUser = asyncHandler( async(req, res, next )=>{
    const { username, fullName, email, password } = req.body;
    // validate that these fields are not empty or undefined
    [username, fullName, email, password].some((item)=>{
        if(!item || item.trim() === ""){
            throw new AppError(400, 'Please fill all the mendatory field');
        }
    })

    // check user is already exist
    const [isEmailExist, isUsernameExist] = await Promise.all([User.findOne({email}), User.findOne({username})])
    if(isEmailExist){
        throw new AppError(400, "email is already exist");
    }
    if(isUsernameExist){
        throw new AppError(400, "username is already exist");
    }

    const avatar = req.files?.['avatar']?.[0];
    const coverImage = req.files?.['coverImage']?.[0];

    // check for avatar 
    if(!avatar?.path){
        throw new AppError(400, "avatar is mendatory.")
    }

    const [uploadedAvatarToCloudinary, uploadedCoverImageToCloudinary ] = await Promise.all([
        uploadFileToCloudinary(avatar?.path), 
        uploadFileToCloudinary(coverImage?.path)
    ]);
    if(!uploadedAvatarToCloudinary){
        throw new AppError(500, "Unable to Upload the avatar")
    }
    if(coverImage?.path && !uploadedCoverImageToCloudinary){
        throw new AppError(500, "Unable to upload the coverImage")
    }

    try {
        const user = await User.create({
            username: username?.toLowerCase(),
            password,
            email: email?.toLowerCase(),
            fullName,
            avatar:uploadedAvatarToCloudinary.secure_url,
            coverImage:uploadedCoverImageToCloudinary?.secure_url || "",
        })
        
        res.status(201).json(new AppResponse(201, { message: "User is successfully created." }));
    } catch (error) {
        console.error("MongoDB error: ", error)
        throw new AppError(500, `An error occured during DB intraction.`)
    }
})

const loginUser = asyncHandler(async(req, res, next)=>{
    
    const {username, email, password } = req.body;
    if(!username && !email){
        throw new AppError(400, "username or email is required.");
    }
    if(!password){
        throw new AppError(400, "Password is required.");
    }

    const user = await User.findOne({$or:[{email},{username}]});
    if(!user){
        throw new AppError(400, 'invalid user name or password.')
    }
    
    const isPasswordValid = await user.isPasswordCorrect(password);
    if(!isPasswordValid){
        throw new AppError(401, "password is invalid.");
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id);

    const loggedinUser = await User.findById(user?._id).select("-password -refreshToken");

    
    res.status(200)
    .cookie("accessToken", accessToken, cookieOption)
    .cookie("refreshToken",refreshToken, cookieOption)
    .json(new AppResponse(
        200,
        {
            user:loggedinUser,
            accessToken,
            refreshToken,
        },
        "User is logged in successfully"
    ))

})

const logoutUser = asyncHandler(async(req, res, next)=>{
    try {
        await User.findByIdAndUpdate(req.user?._id,
            {
                $set:{ refreshToken: undefined },
            },
            { new: true}
        );
        
        res.status(200)
        .clearCookie("refreshToken", cookieOption)
        .clearCookie("accessToken", cookieOption)
        .json(new AppResponse(200,{},"user logged out successfully"));
    } catch (error) {
        throw new AppError(400, "Invalid token")
    }
})

const refreshAccessToken = asyncHandler(async(req, res, next) => {
    try {
        const incomingRefreshToken = req.cookie?.refreshToken || req.body?.refreshToken;
        if(!incomingRefreshToken){
            throw new AppError(400, "unauthorized access");
        }
    
        const decodeToken = await jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    
        const user = await User.findById(decodeToken?._id);
    
        if(!user){
            throw new AppError(401, "Invalid refresh token");
        }
    
        if(incomingRefreshToken !== user.refreshToken){
            throw new AppError(401, "Invalid refresh token");
        }
    
        const {accessToken, refreshToken } = await generateAccessAndRefreshToken(user?._id);
    
        res.status(200)
        .cookie("accessToken", accessToken, cookieOption)
        .cookie("refreshToken", refreshToken, cookieOption)
        .json({
            accessToken,
            refreshToken
        })
    } catch (error) {
        throw new AppError(401, "Invalid refresh token");
    }
})

const changePassword = asyncHandler(async(req, res, next)=>{
    try {
        const { oldPassword, newPassword } = req.body;
        const  userId  = req.user?._id;
        const user = await User.findById(userId);
        const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
        if(!isPasswordCorrect){
            throw new AppError(400, "Password is incorrect.");
        }
        user.password = newPassword;
        user.save({ validateBeforeSave: false})

        res.status(200)
        .json(new AppResponse(200,{}, "Password is updated successfully."))
    } catch (error) {
        throw new AppError(error.statusCode || 500, error.message)
    }
})

const editUserInfo = asyncHandler(async(req, res, next)=>{
    // here we updata all the fields except files
    const { fullName, email, username } = req.body;
    const userId = req.user?._id;
    let objectTosave = {};

    if(fullName !== undefined || fullName !== null){
        objectTosave['fullName'] = fullName;
    }

    if(email !== undefined || email !== null){
        objectTosave['email'] = email;
    }

    if(username !== undefined || username !== null){
        objectTosave['username'] = username;
    }

    const user = await User.findByIdAndUpdate(
        userId,
        { $set: objectTosave },
        { new: true }
    )

    res.status(200)
    .json(new AppResponse(200, user, "user is updated successfully"))



})

const editUserAvatar = asyncHandler(async(req, res, next)=>{
    try {
        const fileLocalPath = req.files?.['avatar']?.[0]?.path;
        const userId = req.user?._id;
    
        if(!fileLocalPath){
            throw new AppError(400, 'Invalid filePath.');
        }
    
        const cloudinaryResponse = await uploadFileToCloudinary(fileLocalPath);
    
        if(!cloudinaryResponse){
            throw new AppError(500, 'Somthing went wrong while uploading resource to cloudinary.');
        }
    
        const user = await User.findByIdAndUpdate(
            userId,
            { $set: { avatar: cloudinaryResponse.secure_url } },
            //{ new: true } we want old user to get previous avatar url.
        )
        const userAvatar = user?.avatar;
        const userPreviousAvatarPublicId = userAvatar?.split('/')?.splice(-1)?.[0]?.split('.')?.[0];
    
        await deleteFileToCloudinary(userPreviousAvatarPublicId);
    
        res.status(200)
        .json(new AppResponse(200, {}, "avatar is successfully updated"));

    } catch (error) {
        throw new AppError(error?.status || 400, error?.message);
    }
})

const editUserCoverImage = asyncHandler(async(req, res, next)=>{
    try {
        const fileLocalPath = req.files?.['coverImage']?.[0]?.path;
        const userId = req.user?._id;
    
        if(!fileLocalPath){
            throw new AppError(400, 'Invalid filePath.');
        }
    
        const cloudinaryResponse = await uploadFileToCloudinary(fileLocalPath);
    
        if(!cloudinaryResponse){
            throw new AppError(500, 'Somthing went wrong while uploading resource to cloudinary.');
        }
    
        const user = await User.findByIdAndUpdate(
            userId,
            { $set: { coverImage: cloudinaryResponse.secure_url } },
            //{ new: true } we want old user to get previous avatar url.
        )
        const userCoverImage = user?.coverImage;
        const cloudinaryPublicId = userCoverImage?.split('/')?.splice(-1)?.[0]?.split('.')?.[0];
    
        await deleteFileToCloudinary(cloudinaryPublicId);
    
        res.status(200)
        .json(new AppResponse(200, {}, "coverImage is successfully updated"));

    } catch (error) {
        throw new AppError(error?.status || 400, error?.message);
    }
})



export { 
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changePassword,
    editUserInfo,
    editUserAvatar,
    editUserCoverImage,
 }