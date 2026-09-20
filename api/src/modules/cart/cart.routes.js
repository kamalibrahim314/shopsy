import { Router } from "express";
import {
    getCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    validateCartStock,
} from "./cart.controller.js";
import { addToCartSchema, updateQuantitySchema } from "./cart.validation.js";
import { validate } from "../../middleware/validation.middleware.js";
import { protect } from "../../middleware/auth.middleware.js";

const cartRouter = Router();

cartRouter.use(protect);

cartRouter.get("/", getCart);
cartRouter.post("/add", validate(addToCartSchema), addToCart);
cartRouter.put("/items/:itemId", validate(updateQuantitySchema), updateQuantity);
cartRouter.delete("/items/:itemId", removeFromCart);
cartRouter.delete("/clear", clearCart);
cartRouter.get("/validate", validateCartStock);

export default cartRouter;
