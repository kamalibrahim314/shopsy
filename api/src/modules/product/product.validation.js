import Joi from "joi";

export const productQuerySchema = {
    query: Joi.object({
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).max(50).default(12),
        category: Joi.string().allow("", null),
        search: Joi.string().allow("", null),
        minPrice: Joi.number().min(0),
        maxPrice: Joi.number().min(0),
        sort: Joi.string().valid("newest", "price-asc", "price-desc", "rating", "popular").default("newest"),
        isFeatured: Joi.boolean(),
        isTrending: Joi.boolean(),
        isTopRated: Joi.boolean(),
        inStock: Joi.boolean(),
    }),
};

export const createProductSchema = {
    body: Joi.object({
        name: Joi.string().min(2).max(200).required(),
        categoryId: Joi.string().uuid().required(),
        description: Joi.string().allow("", null),
        price: Joi.number().min(0).required(),
        discountPrice: Joi.number().min(0).allow(null),
        stock: Joi.number().integer().min(0).default(0),
        colors: Joi.alternatives().try(Joi.array().items(Joi.string()), Joi.string()),
        sizes: Joi.alternatives().try(Joi.array().items(Joi.string()), Joi.string()),
        images: Joi.alternatives().try(Joi.array().items(Joi.string()), Joi.string()),
        isFeatured: Joi.boolean().default(false),
        isTrending: Joi.boolean().default(false),
        isTopRated: Joi.boolean().default(false),
    }),
};

export const updateProductSchema = {
    body: Joi.object({
        name: Joi.string().min(2).max(200),
        categoryId: Joi.string().uuid(),
        description: Joi.string().allow("", null),
        price: Joi.number().min(0),
        discountPrice: Joi.number().min(0).allow(null),
        stock: Joi.number().integer().min(0),
        colors: Joi.alternatives().try(Joi.array().items(Joi.string()), Joi.string()),
        sizes: Joi.alternatives().try(Joi.array().items(Joi.string()), Joi.string()),
        images: Joi.alternatives().try(Joi.array().items(Joi.string()), Joi.string()),
        isFeatured: Joi.boolean(),
        isTrending: Joi.boolean(),
        isTopRated: Joi.boolean(),
    }),
};
