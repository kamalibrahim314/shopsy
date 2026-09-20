import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (fileBuffer, folder = "shopsy") => {
    return new Promise((resolve, reject) => {
        // If credentials are placeholders, fallback gracefully
        if (!process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_API_KEY === "your_api_key") {
            const simulatedUrl = `https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&auto=format&fit=crop&q=60`;
            return resolve({
                secure_url: simulatedUrl,
                public_id: `fallback_${Date.now()}`,
            });
        }

        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: "auto",
            },
            (error, result) => {
                if (error) return reject(error);
                resolve({
                    secure_url: result.secure_url,
                    public_id: result.public_id,
                });
            }
        );

        uploadStream.end(fileBuffer);
    });
};

export const deleteFromCloudinary = async (publicId) => {
    if (!publicId || publicId.startsWith("fallback_")) return;
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error("Cloudinary deletion failed:", error);
    }
};

export default cloudinary;
