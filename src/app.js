import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';


const app = express();

app.use(cors({origin: process.env.CORS_ORIGIN })); 
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));
app.use(cookieParser());

// import routers here
import userRouter from './routes/user.router.js'
import channelProfileRouter from './routes/channelProfile.router.js'
import videoRouter from './routes/video.router.js'
import commentRouter from './routes/comment.router.js'
import lileRouter from './routes/like.router.js'

app.use('/api/v1/users', userRouter);
app.use('/api/v1/channel', channelProfileRouter)
app.use('/api/v1/video', videoRouter);
app.use('/api/v1/comment', commentRouter);
app.use('/api/v1/like', lileRouter);






export { app };

