import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async ()=>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URL}/${DB_NAME}`);
        console.info(`mongoDB is connected successfully!!!`)
    } catch (error) {
        console.error("MongoDB connection error: ",error);
        process.exit(1);
    }

}

export default connectDB;