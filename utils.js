import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config()

const mongodbUrl = process.env.MONGODB_URL

const dbConnection = async () => {
    try {
        await mongoose.connect(mongodbUrl)
        console.log("connected to mongodb!")
    } catch (err) {
        console.log("failed to connect", err.message)
    }
}

export default dbConnection

