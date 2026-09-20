import { DataTypes } from "sequelize";
import { sequelize } from "../DBConnection.js";

export const Order = sequelize.define("Order", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    orderNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    status: {
        type: DataTypes.ENUM("pending", "processing", "shipped", "delivered", "cancelled"),
        defaultValue: "pending",
    },
    paymentStatus: {
        type: DataTypes.ENUM("pending", "paid", "failed"),
        defaultValue: "pending",
    },
    paymentMethod: {
        type: DataTypes.ENUM("cod", "card"),
        defaultValue: "cod",
    },
    itemsPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    shippingPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
    },
    taxPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
    },
    totalPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    shippingAddress: {
        type: DataTypes.JSON,
        allowNull: false,
    },
});
