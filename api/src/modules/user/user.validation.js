import Joi from "joi";

export const updateProfileSchema = {
    body: Joi.object({
        name: Joi.string().min(2).max(50),
        phone: Joi.string().allow("", null),
        avatar: Joi.string().uri().allow("", null),
    }),
};

export const addressSchema = {
    body: Joi.object({
        fullName: Joi.string().required(),
        phone: Joi.string().required(),
        street: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        postalCode: Joi.string().required(),
        country: Joi.string().default("Egypt"),
        isDefault: Joi.boolean().default(false),
    }),
};

export const updateAddressSchema = {
    body: Joi.object({
        fullName: Joi.string(),
        phone: Joi.string(),
        street: Joi.string(),
        city: Joi.string(),
        state: Joi.string(),
        postalCode: Joi.string(),
        country: Joi.string(),
        isDefault: Joi.boolean(),
    }),
};
