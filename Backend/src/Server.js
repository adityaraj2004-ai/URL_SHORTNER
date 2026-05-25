import dotenv from "dotenv"
dotenv.config()

import app from "./App.js";
import { connectDB } from "./Config/DB.js";

const PORT = process.env.PORT || 3000
const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server is running on ${PORT}`)
        })
    } catch (error) {
        console.error("Error COnnecting to the Server", error.message)
        process.exit(1)
    }
}
startServer()