require("dotenv").config()
const { v2: cloudinary } = require("cloudinary")

const cloudName = process.env.CLOUDINARY_CLOUD_NAME
const apiKey = process.env.CLOUDINARY_API_KEY
const apiSecret = process.env.CLOUDINARY_API_SECRET

if (!cloudName || !apiKey || !apiSecret) {
    console.warn("Cloudinary credentials are missing. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in .env")
}

cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true
})

const UPLOAD_URL_PATTERN = /^https?:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/(?:v\d+\/)?(.+)$/
const IMAGE_EXTENSION_PATTERN = /\.(?:jpe?g|png|gif|webp|avif|svg|bmp|ico)$/i

const extractPublicId = (value) => {
    if (typeof value !== "string" || value.length === 0) {
        return null
    }

    if (!value.startsWith("http")) {
        return value
    }

    const match = value.match(UPLOAD_URL_PATTERN)

    if (!match) {
        return null
    }

    return match[1].replace(IMAGE_EXTENSION_PATTERN, "")
}

const destroyImage = async (publicId) => {
    if (!publicId) {
        return
    }

    try {
        const result = await cloudinary.uploader.destroy(publicId)
        if (result.result !== "ok" && result.result !== "not found") {
            console.log("Cloudinary destroy returned:", result.result)
        }
    } catch (error) {
        console.log("Cloudinary destroy error:", error.message)
    }
}

module.exports = { cloudinary, extractPublicId, destroyImage }
