import { Router } from "express";
import { varifyToken } from "../middleware/auth.middleware";
import { likeComment, likeVideo, unlikeComment, unlikeVideo } from "../controller/like.controller";

const router = Router();

router.post('/like-comment', varifyToken, likeComment);
router.post('/unlike-comment', varifyToken, unlikeComment);
router.post('/like-video', varifyToken, likeVideo);
router.post('/unlike-video', varifyToken, unlikeVideo);


export default router;