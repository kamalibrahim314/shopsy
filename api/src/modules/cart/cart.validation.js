import Joi from "joi";

export const addToCartSchema = {
    body: Joi.object({
        productId: Joi.string().uuid().required(),
        quantity: Joi.number().integer().min(1).default(1),
        size: Joi.string().allow("", null),
        color: Joi.string().allow("", null),
    }),
};

export const updateQuantitySchema = {
    body: Joi.object({
        quantity: Joi.number().integer().min(1).required(),
    }),
};
