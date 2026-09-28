require("dotenv").config()
const express = require("express")
const cors = require("cors")
const { connectDB } = require("./config/db")
const dns = require("node:dns")
const { controlRegister } = require("./controllers/register")
const { controlUpdateAvatar, controlDeleteAvatar } = require("./controllers/avatar")
const { upload } = require("./middleware/upload")

dns.setServers(["1.1.1.1"])

const app = express()
app.use(cors())
app.use(express.json())
const port = process.env.PORT || 8000

app.get("/", (req, res) => {
    res.send({
        "message": "Hello",
        "code": 200,
    })
})

app.post("/register", upload.single("profilePicture"), controlRegister)
app.post("/users/:email/avatar", upload.single("profilePicture"), controlUpdateAvatar)
app.delete("/users/:email/avatar", controlDeleteAvatar)

app.use((err, req, res, next) => {
    if (err instanceof require("multer").MulterError) {
        return res.status(400).json({
            message: err.code === "LIMIT_FILE_SIZE" ? "Image must be 5MB or smaller" : err.message
        })
    }
    if (err) {
        return res.status(400).json({
            message: err.message || "Invalid upload"
        })
    }
    next()
})

app.listen(port, ()=> {
    console.log("Server is running on port:", port)
    connectDB();
})