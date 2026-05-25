import mongoose from "mongoose";
import { DB_NAME } from "../Constant.js";


const MONGO_URL = process.env.MONGO_URL;
export const connectDB = async () => {
    try {
        await mongoose.connect(`${MONGO_URL}/${DB_NAME}`);
        console.log(`Connected Database Successfully`);
    } catch (error) {
        console.error("Error Connecting Database", error.message)
        process.exit(1)
    }
}