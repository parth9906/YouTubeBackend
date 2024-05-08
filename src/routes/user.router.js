import { Router } from "express";
import { loginUser, logoutUser, refreshAccessToken, registerUser } from '../controller/user.controller.js'
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

// secured Routes
router.post('/logout', varifyToken, logoutUser);
router.post('/refresh-token', refreshAccessToken); // Don't need user object in req object



export default router;
