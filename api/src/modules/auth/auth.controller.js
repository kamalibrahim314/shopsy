import jwt from "jsonwebtoken";
import { User, Cart } from "../../DB/models/associactions.js";
import { AppError } from "../../utils/appError.js";
import { catchAsync } from "../../utils/catchAsync.js";

const signToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET || "shopsy_super_secret_jwt_key_2026_secure", {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    });
};

const sendTokenResponse = (user, statusCode, res, message = "Success") => {
    const token = signToken(user.id, user.role);

    const isProduction = process.env.NODE_ENV === "production";
    const cookieOptions = {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        path: "/",
    };

    res.cookie("token", token, cookieOptions);

    const userObj = user.toJSON ? user.toJSON() : { ...user };
    delete userObj.password;

    res.status(statusCode).json({
        success: true,
        message,
        token,
        user: userObj,
    });
};

export const register = catchAsync(async (req, res, next) => {
    const { name, email, password, phone } = req.body;

    const existingUser = await User.findOne({ where: { email: email.toLowerCase() } });
    if (existingUser) {
        return next(new AppError("An account with this email already exists", 400));
    }

    const user = await User.create({
        name,
        email: email.toLowerCase(),
        password,
        phone,
    });

    // Create an initial cart for the user
    await Cart.findOrCreate({ where: { userId: user.id } });

    sendTokenResponse(user, 201, res, "Registration successful");
});

export const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email: email.toLowerCase() } });
    if (!user || !(await user.comparePassword(password))) {
        return next(new AppError("Invalid email or password", 401));
    }

    // Ensure cart exists
    await Cart.findOrCreate({ where: { userId: user.id } });

    sendTokenResponse(user, 200, res, "Logged in successfully");
});

export const logout = catchAsync(async (req, res, next) => {
    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("token", "loggedout", {
        expires: new Date(Date.now() + 5 * 1000),
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        path: "/",
    });

    res.status(200).json({
        success: true,
        message: "Logged out successfully",
    });
});

export const getMe = catchAsync(async (req, res, next) => {
    const user = await User.findByPk(req.user.id, {
        attributes: { exclude: ["password"] },
    });

    if (!user) {
        return next(new AppError("User not found", 404));
    }

    res.status(200).json({
        success: true,
        user,
    });
});

export const updatePassword = catchAsync(async (req, res, next) => {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findByPk(req.user.id);
    if (!user || !(await user.comparePassword(currentPassword))) {
        return next(new AppError("Incorrect current password", 400));
    }

    user.password = newPassword;
    await user.save();

    sendTokenResponse(user, 200, res, "Password updated successfully");
});
