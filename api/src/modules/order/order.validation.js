import Joi from "joi";

export const createOrderSchema = {
    body: Joi.object({
        addressId: Joi.string().uuid(),
        shippingAddress: Joi.object({
            fullName: Joi.string().required(),
            phone: Joi.string().required(),
            street: Joi.string().required(),
            city: Joi.string().required(),
            state: Joi.string().required(),
            postalCode: Joi.string().required(),
            country: Joi.string().default("Egypt"),
        }),
        paymentMethod: Joi.string().valid("cod", "card").default("cod"),
        // Direct buy-now support (optional)
        directItem: Joi.object({
            productId: Joi.string().uuid().required(),
            quantity: Joi.number().integer().min(1).default(1),
            size: Joi.string().allow("", null),
            color: Joi.string().allow("", null),
        }),
    }),
};

export const updateOrderStatusSchema = {
    body: Joi.object({
        status: Joi.string().valid("pending", "processing", "shipped", "delivered", "cancelled"),
        paymentStatus: Joi.string().valid("pending", "paid", "failed"),
    }),
};
