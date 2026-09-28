const multer = require("multer")
const { CloudinaryStorage } = require("multer-storage-cloudinary")
const { cloudinary } = require("../config/cloudinary.js")

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: process.env.CLOUDINARY_FOLDER || "avatars",
        resource_type: "image",
        quality: "auto",
        fetch_format: "auto"
    }
})

const allowedTypes = new Set(["image/jpeg", "image/png", "image/gif", "image/webp"])

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        if (allowedTypes.has(file.mimetype)) {
            cb(null, true)
        } else {
            cb(new Error("Only JPEG, PNG, GIF and WebP images are allowed"))
        }
    }
})

module.exports = { upload }
