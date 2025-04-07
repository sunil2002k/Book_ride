import UserModel from "../models/user.model.js";
import { createUser } from "../services/user.service.js";
import { validationResult } from "express-validator";
import blackListTokenModel from "../models/blacklistToken.model.js";

const registerUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, email, password } = req.body;
    const isUserAlready = await UserModel.findOne({ email });

    if (isUserAlready) {
        return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password using the static method
    const hashedPassword = await UserModel.hashPassword(password);

    // Create the user using the service function
    const user = await createUser({
        firstname: fullname.firstname,
        lastname: fullname.lastname,
        email,
        password: hashedPassword,
    });

    // Generate an authentication token
    const token = user.generateAuthToken();

    res.status(201).json({ token, user });
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Find the user by email
    const user = await UserModel.findOne({ email }).select("+password");
    if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare the password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate an authentication token
    const token = user.generateAuthToken();

    res.cookie("token", token);

    res.status(200).json({ token, user });
};

const getUserProfile = async (req, res) => {
    const userId = req.user._id; // Assuming you have middleware to set req.user from the token
    const user = await UserModel.findById(userId).select("-password");
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
};

const logoutUser = async (req, res, next) => {
    res.clearCookie("token");
    const token = req.cookies.token || req.headers.authorization.split(" ")[1];

    await blackListTokenModel.create({ token });

    res.status(200).json({ message: "Logged out" });
};

export default { registerUser, loginUser, getUserProfile, logoutUser };