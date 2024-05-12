import { Router } from "express";
import { varifyToken } from "../middleware/auth.middleware.js";
import { deleteCommentOnVideo, editCommentOnVideo, postCommentOnVideo } from "../controller/comment.controller.js";

const router = Router();

router.post('/post-comment', varifyToken, postCommentOnVideo);
router.post('/edit-comment', varifyToken, editCommentOnVideo);
router.post('/delete-comment', varifyToken, deleteCommentOnVideo);


export default router;