const User = require("../schemas/userSchema.js")
const { extractPublicId, destroyImage } = require("../config/cloudinary.js")

const controlUpdateAvatar = async (req, res) => {
    try {
        const { email } = req.params

        if (!req.file) {
            return res.status(400).json({
                message: "No image provided"
            })
        }

        const user = await User.findOne({ email })

        if (!user) {
            await destroyImage(req.file.filename)
            return res.status(404).json({
                message: "User not found"
            })
        }

        const previousPublicId = extractPublicId(user.profilePicture)

        user.profilePicture = req.file.path
        await user.save()

        if (previousPublicId) {
            await destroyImage(previousPublicId)
        }

        res.status(200).json({
            message: "Profile picture updated successfully",
            profilePicture: user.profilePicture
        })
    }
    catch (error) {
        console.log(error)
        await destroyImage(req.file?.filename)
        res.status(500).json({
            message: "Something went wrong. Please try again."
        })
    }
}

const controlDeleteAvatar = async (req, res) => {
    try {
        const { email } = req.params

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        if (!user.profilePicture) {
            return res.status(404).json({
                message: "No profile picture set"
            })
        }

        const previousPublicId = extractPublicId(user.profilePicture)

        user.profilePicture = null
        await user.save()

        if (previousPublicId) {
            await destroyImage(previousPublicId)
        }

        res.status(200).json({
            message: "Profile picture removed"
        })
    }
    catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Something went wrong. Please try again."
        })
    }
}

module.exports = { controlUpdateAvatar, controlDeleteAvatar }
