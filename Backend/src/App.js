import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet"
import morgan from "morgan"
import urlRouter from "./Routes/url.routes.js";

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}))

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))

app.use(express.static("public"))

app.use(cookieParser())
app.use(morgan("dev"))
app.use(helmet(
    { crossOriginResourcePolicy: false }
))

app.use("/api/v1/url", urlRouter)

app.get("/", (req, res) => {
    return res.status(200).json(
        {
            success: true,
            message: "URL Shortner Server is running"
        }
    )
})

export default app;
