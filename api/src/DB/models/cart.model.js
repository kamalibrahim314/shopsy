import { DataTypes } from "sequelize";
import { sequelize } from "../DBConnection.js";

export const Cart = sequelize.define("Cart", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
    },
});
