import { DataTypes } from "sequelize";
import { sequelize } from "../DBConnection.js";

export const Product = sequelize.define("Product", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    categoryId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    discountPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    rating: {
        type: DataTypes.DECIMAL(3, 2),
        defaultValue: 0.0,
    },
    numReviews: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    isFeatured: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    isTrending: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    isTopRated: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    colors: {
        type: DataTypes.JSON,
        defaultValue: [],
    },
    sizes: {
        type: DataTypes.JSON,
        defaultValue: [],
    },
    images: {
        type: DataTypes.JSON,
        defaultValue: [],
    },
});
