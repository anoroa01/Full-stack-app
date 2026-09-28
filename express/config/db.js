require("dotenv").config()
const mongoose = require("mongoose")

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URL, {
            retryWrites: true,
            w: "majority"
        })
        console.log("Connected to DB")
    } catch (e) {
        console.log("DB error: ", e)
    }
}

module.exports = {connectDB}