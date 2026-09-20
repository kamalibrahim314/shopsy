import jwt from "jsonwebtoken";
import { User } from "../DB/models/associactions.js";
import { AppError } from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";

export const protect = catchAsync(async (req, res, next) => {
    let token = null;

    if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    } else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return next(new AppError("You are not logged in. Please log in to get access.", 401));
    }

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET || "shopsy_super_secret_jwt_key_2026_secure");
    } catch (err) {
        return next(new AppError("Invalid or expired token. Please log in again.", 401));
    }

    const currentUser = await User.findByPk(decoded.id);
    if (!currentUser) {
        return next(new AppError("The user belonging to this token no longer exists.", 401));
    }

    req.user = currentUser;
    next();
});

export const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError("You do not have permission to perform this action.", 403));
        }
        next();
    };
};

export const optionalAuth = catchAsync(async (req, res, next) => {
    let token = null;
    if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    } else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || "shopsy_super_secret_jwt_key_2026_secure");
            const currentUser = await User.findByPk(decoded.id);
            if (currentUser) {
                req.user = currentUser;
            }
        } catch {
            // ignore invalid token for optional auth
        }
    }
    next();
});
