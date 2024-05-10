import { Router } from "express";
import { changePassword, editUserCoverImage, editUserAvatar, editUserInfo, loginUser, logoutUser, refreshAccessToken, registerUser } from '../controller/user.controller.js'
import { upload } from "../middleware/multer.middleware.js";
import { varifyToken } from "../middleware/auth.middleware.js";

const uploadFieldsForRegisterUser = [
    {
        name:'avatar',
        maxCount:1,
    },
    {
        name:'coverImage',
        maxCount:1,
    }
]


const router = Router();

router.post('/register', upload.fields(uploadFieldsForRegisterUser), registerUser);
router.post('/login', loginUser);
router.post('/refresh-token', refreshAccessToken); // Don't need user object in req object

// secured Routes
router.post('/logout', varifyToken, logoutUser);
router.post('/change-user-password', varifyToken, changePassword)
router.post('/edit-user-info', varifyToken, editUserInfo);
router.post('/edit-user-avatar', varifyToken, upload.fields([{name: 'avatar', maxCount: 1}]), editUserAvatar);
router.post('/edit-user-cover-image', varifyToken, upload.fields([{name: 'coverImage', maxCount: 1}]), editUserCoverImage);




export default router;
