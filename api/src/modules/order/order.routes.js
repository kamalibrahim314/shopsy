import { Router } from "express";
import {
    createOrder,
    getMyOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus,
} from "./order.controller.js";
import { createOrderSchema, updateOrderStatusSchema } from "./order.validation.js";
import { validate } from "../../middleware/validation.middleware.js";
import { protect, restrictTo } from "../../middleware/auth.middleware.js";

const orderRouter = Router();

orderRouter.use(protect);

orderRouter.post("/", validate(createOrderSchema), createOrder);
orderRouter.get("/my", getMyOrders);
orderRouter.get("/:id", getOrderById);

// Admin routes
orderRouter.get("/", restrictTo("admin"), getAllOrders);
orderRouter.patch("/:id/status", restrictTo("admin"), validate(updateOrderStatusSchema), updateOrderStatus);

export default orderRouter;
