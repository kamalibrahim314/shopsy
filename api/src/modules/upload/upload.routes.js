import { Router } from "express";
import { upload } from "../../middleware/upload.middleware.js";
import { protect, restrictTo } from "../../middleware/auth.middleware.js";
import { uploadToCloudinary } from "../../services/cloudinary.service.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { AppError } from "../../utils/appError.js";

const uploadRouter = Router();

uploadRouter.post(
    "/image",
    protect,
    upload.single("image"),
    catchAsync(async (req, res, next) => {
        if (!req.file) {
            return next(new AppError("Please upload an image file", 400));
        }

        const folder = req.query.folder || "shopsy/uploads";
        const result = await uploadToCloudinary(req.file.buffer, folder);

        res.status(200).json({
            success: true,
            url: result.secure_url,
            public_id: result.public_id,
        });
    })
);

uploadRouter.post(
    "/images",
    protect,
    upload.array("images", 5),
    catchAsync(async (req, res, next) => {
        if (!req.files || req.files.length === 0) {
            return next(new AppError("Please upload at least one image file", 400));
        }

        const folder = req.query.folder || "shopsy/uploads";
        const results = [];

        for (const file of req.files) {
            const res = await uploadToCloudinary(file.buffer, folder);
            results.push(res.secure_url);
        }

        res.status(200).json({
            success: true,
            urls: results,
        });
    })
);

export default uploadRouter;


