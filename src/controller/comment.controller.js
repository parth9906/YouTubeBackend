import { asyncHandler } from "../utils/asyncHandler";

const postCommentOnVideo = asyncHandler(async(req, res, next)=>{
    const userID = req.user?._id;
})

const editCommentOnVideo = asyncHandler(async(req, res, next)=>{
    
})
const deleteCommentOnVideo = asyncHandler(async(req, res, next)=>{
    
})

export {
    postCommentOnVideo,
    editCommentOnVideo,
    deleteCommentOnVideo,
}

