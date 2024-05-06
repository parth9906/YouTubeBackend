import { Router } from "express";
import { registerUser } from '../controller/user.controller.js'
import { upload } from "../middleware/multer.middleware.js";

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

router.post('/register', upload.fields(uploadFieldsForRegisterUser), registerUser)



export default router;
