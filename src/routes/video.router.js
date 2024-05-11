import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import { varifyToken } from "../middleware/auth.middleware.js";
import { editThumbnail, increaseViewCount, postVideo, searchVideoByText, updateVideoInfo } from "../controller/video.controller.js";


const router = Router();

router.post('/post-video', varifyToken, upload.fields([{name: 'videoFile',maxCount: 1},{name: 'thumbnailImage',maxCount: 1}]), postVideo)
router.post('/edit-video-info',varifyToken, updateVideoInfo);
router.post('/increase-view-count', varifyToken, increaseViewCount);
router.post('/get-videos-by-text', varifyToken, searchVideoByText);
router.post('/edit-thumbnail', varifyToken, upload.fields([{name: 'thumbnailImage',maxCount: 1}]), editThumbnail)




export default router;