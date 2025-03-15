import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import connectDB from './config/db.js';
import couponRouter from './routes/coupon.routes.js'
const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use(cookieParser());


const limiter = rateLimit({ windowMs: 60 * 1000, max: 10 });
app.use('/api/claim', limiter);


connectDB();

app.use('/api/claim', couponRouter);

app.listen(PORT, () => {
    console.log("server is running: http://localhost:" + PORT)
})