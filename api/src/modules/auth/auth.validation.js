import Joi from "joi";

export const registerSchema = {
    body: Joi.object({
        name: Joi.string().min(2).max(50).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(100).required(),
        phone: Joi.string().allow("", null),
    }),
};

export const loginSchema = {
    body: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    }),
};

export const updatePasswordSchema = {
    body: Joi.object({
        currentPassword: Joi.string().required(),
        newPassword: Joi.string().min(6).max(100).required(),
    }),
};
