import dotenv from "dotenv";
dotenv.config();
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import xss from "xss";
import { connectDB, syncDB } from "./DB/DBConnection.js";
import "./DB/models/associactions.js";
import router from "./modules/index.js";
import { AppError } from "./utils/appError.js";

const app = express();
let ready = false;
let server = null;
let isInitialized = false;
let dbInitPromise = null;

// Ensure database connection is established (reused across serverless warm invocations)
const ensureDBConnected = async (req, res, next) => {
    try {
        if (!dbInitPromise) {
            dbInitPromise = connectDB();
        }
        await dbInitPromise;
        next();
    } catch (err) {
        dbInitPromise = null;
        next(err);
    }
};

export const initApp = () => {
    if (isInitialized) return app;

    app.set("trust proxy", 1);

    app.use(helmet({
        crossOriginResourcePolicy: { policy: "cross-origin" },
        referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    }));

    const defaultDevOrigins = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ];

    const configuredOrigins = (process.env.ALLOWED_ORIGIN || "")
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean);

    const allowedOrigins = Array.from(new Set([...configuredOrigins, ...defaultDevOrigins]));

    app.use(cors({
        origin: (origin, callback) => {
            if (!origin) return callback(null, true);
            if (allowedOrigins.includes(origin)) return callback(null, true);

            // Allow matching wildcard domains (e.g. Vercel preview URLs if configured)
            const isAllowedPattern = configuredOrigins.some((pattern) => {
                if (pattern.includes("*")) {
                    const regex = new RegExp("^" + pattern.replace(/\*/g, ".*") + "$");
                    return regex.test(origin);
                }
                return false;
            });
            if (isAllowedPattern) return callback(null, true);

            return callback(new AppError("Not allowed by CORS", 403));
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "Range", "X-Requested-With"],
        exposedHeaders: ["Content-Range", "Content-Length", "Accept-Ranges", "Set-Cookie"],
    }));

    const isDev = process.env.NODE_ENV !== "production";
    const authStrictLimiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: isDev ? 1000 : 10,
        standardHeaders: true,
        legacyHeaders: false,
        validate: { trustProxy: false },
        handler: (req, res) => {
            res.status(429).json({
                success: false,
                code: 429,
                message: "Too many attempts, please try again after 15 minutes",
                arabicMessage: "تم تجاوز الحد المسموح من المحاولات، يرجى المحاولة بعد 15 دقيقة",
            });
        },
    });

    const authGeneralLimiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: isDev ? 2000 : 30,
        standardHeaders: true,
        legacyHeaders: false,
        validate: { trustProxy: false },
        handler: (req, res) => {
            res.status(429).json({
                success: false,
                code: 429,
                message: "Too many requests from this IP, please try again later",
                arabicMessage: "تم تجاوز الحد المسموح من الطلبات، يرجى المحاولة لاحقاً",
            });
        },
    });

    app.use("/auth/login", authStrictLimiter);
    app.use("/auth/register", authStrictLimiter);
    app.use("/auth", authGeneralLimiter);

    // Body parsers & sanitization
    app.use(cookieParser());
    app.use(express.json({ limit: "50mb" }));
    app.use(express.urlencoded({ extended: true, limit: "50mb" }));

    app.use((req, res, next) => {
        try {
            if (req.body && typeof req.body === "object" && Object.keys(req.body).length) {
                Object.assign(req.body, JSON.parse(xss(JSON.stringify(req.body))));
            }
            if (req.query && typeof req.query === "object" && Object.keys(req.query).length) {
                Object.assign(req.query, JSON.parse(xss(JSON.stringify(req.query))));
            }
            if (req.params && typeof req.params === "object" && Object.keys(req.params).length) {
                Object.assign(req.params, JSON.parse(xss(JSON.stringify(req.params))));
            }
            next();
        } catch (error) {
            next(error);
        }
    });

    // Ensure database readiness for incoming requests
    app.use(ensureDBConnected);

    // API routes (mounted at root and /api for high compatibility)
    app.use("/", router);
    app.use("/api", router);

    // Handle undefined routes
    app.use((req, res, next) => {
        next(new AppError(`Invalid URL: ${req.originalUrl}`, 404));
    });

    // Centralized error handling
    app.use((err, req, res, next) => {
        const statusCode = Number(err.statusCode) || 500;

        const response = {
            success: false,
            code: statusCode,
            message: statusCode >= 500 && process.env.NODE_ENV === "production"
                ? "An unexpected error occurred"
                : err.message ?? "An unexpected error occurred",
        };
        if (process.env.NODE_ENV !== "production" && err.details) response.details = err.details;
        res.status(statusCode).json(response);
    });

    isInitialized = true;
    return app;
};

// Local standalone server startup (used by server.js / npm run dev)
export const bootstrap = async () => {
    initApp();

    await connectDB();
    await syncDB();

    const PORT = process.env.PORT || 5001;

    server = await new Promise((resolve, reject) => {
        const instance = app.listen(PORT, "0.0.0.0", () => {
            ready = true;
            console.log(`🔗 http://localhost:${PORT}`);
            resolve(instance);
        });
        instance.once("error", reject);
    });
    return server;
};

// Initialize app configuration on module import
initApp();

export { app };
export default app;