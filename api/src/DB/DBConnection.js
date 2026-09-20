import dotenv from "dotenv";

dotenv.config();

import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(
    process.env.MYSQL_DATABASE,
    process.env.MYSQL_USER,
    process.env.MYSQL_PASSWORD,
    {
        host: process.env.MYSQL_HOST,
        port: Number(process.env.MYSQL_PORT ?? 4000),
        dialect: "mysql",
        logging: false,
        timezone: process.env.MYSQL_TIMEZONE || "+00:00",

        dialectOptions: {
            charset: "utf8mb4",
            supportBigNumbers: true,
            bigNumberStrings: true,
            ssl: {
                rejectUnauthorized: true,
            },
        },

        define: {
            timestamps: true,
            underscored: false,
            freezeTableName: true,
        },

        pool: {
            max: Number(process.env.MYSQL_POOL_MAX || (process.env.NODE_ENV === "production" ? 2 : 10)),
            min: 0,
            idle: Number(process.env.MYSQL_POOL_IDLE || 10000),
            acquire: Number(process.env.MYSQL_POOL_ACQUIRE || 30000),
            evict: 1000,
        },
    }
);

let isConnected = false;

// Test / establish the database connection (idempotent for serverless reuse)
export const connectDB = async () => {
    if (isConnected) return;
    try {
        await sequelize.authenticate();
        isConnected = true;
        console.log("Connection has been established successfully.");
    } catch (error) {
        isConnected = false;
        console.error("Unable to connect to the database:", error);
        throw error;
    }
};

export const syncDB = async () => {
    try {
        if (process.env.NODE_ENV === "development") {
            await sequelize.sync({ alter: false });
            console.log("Models synced (development only).");
        }
    } catch (error) {
        console.error("Error syncing database:", error);
        throw error;
    }
};