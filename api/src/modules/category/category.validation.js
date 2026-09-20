import Joi from "joi";

export const categorySchema = {
    body: Joi.object({
        name: Joi.string().min(2).max(100).required(),
        slug: Joi.string().min(2).max(100),
        description: Joi.string().allow("", null),
        image: Joi.string().allow("", null),
    }),
};

export const updateCategorySchema = {
    body: Joi.object({
        name: Joi.string().min(2).max(100),
        slug: Joi.string().min(2).max(100),
        description: Joi.string().allow("", null),
        image: Joi.string().allow("", null),
    }),
};
