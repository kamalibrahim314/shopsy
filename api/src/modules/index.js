import { Router } from "express";
import authRouter from "./auth/auth.routes.js";
import userRouter from "./user/user.routes.js";
import categoryRouter from "./category/category.routes.js";
import productRouter from "./product/product.routes.js";
import cartRouter from "./cart/cart.routes.js";
import orderRouter from "./order/order.routes.js";
import uploadRouter from "./upload/upload.routes.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/categories", categoryRouter);
router.use("/products", productRouter);
router.use("/cart", cartRouter);
router.use("/orders", orderRouter);
router.use("/upload", uploadRouter);

router.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", timestamp: new Date() });
});

export default router;