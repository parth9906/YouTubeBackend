import { asyncHandler } from '../utils/asyncHandler.js'
import { AppError } from '../utils/AppError.js';
import { AppResponse } from '../utils/AppResponse.js'
import { User } from '../models/user.models.js';
import { uploadFileToCloudinary } from '../utils/cloudinary.js';

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
            coverImage:uploadedCoverImageToCloudinary?.secure_url,
        })
        
        res.status(201).json(new AppResponse(201, { message: "User is successfully created." }));
    } catch (error) {
        console.error("MongoDB error: ", error)
        throw new AppError(500, `An error occured during DB intraction.`)
    }
})

export { 
    registerUser,

 }