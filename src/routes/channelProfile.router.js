import { Router } from 'express';
import { getChannelProfileData, subscribedToChannel, unSubscribedToChannel, getChannleVideos } from '../controller/channelProfile.controller.js'
import { varifyToken } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/ch/:username', varifyToken, getChannelProfileData);
router.post('/subscribe', varifyToken, subscribedToChannel);
router.post('/unsubscribe', varifyToken, unSubscribedToChannel);
router.post('/get-videos/:username', varifyToken, getChannleVideos);


export default router;