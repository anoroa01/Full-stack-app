const User = require("../schemas/userSchema.js");
const { destroyImage } = require("../config/cloudinary.js");

const controlRegister = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            await destroyImage(req.file?.filename);
            return res.status(409).json({
                message: "Account already exists"
            });
        }

        const profilePicture = req.file ? req.file.path : null;

        const user = await User.create({
            name,
            email,
            password,
            profilePicture
        });

        res.status(201).json({
            message: "User created successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                profilePicture: user.profilePicture
            }
        });
    }
    catch (error) {
        console.log(error);
        await destroyImage(req.file?.filename);
        res.status(500).json({
            message: "Something went wrong. Please try again."
        });
    }
};

module.exports = { controlRegister };
