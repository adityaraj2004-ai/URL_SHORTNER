import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}))

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))

app.use(express.static("public"))


app.use(cookieParser())




app.get("/", (req, res) => {
    return res.status(200).json(
        {
            success: true,
            message: "URL Shortner Server is running"
        }
    )
})

export default app;
