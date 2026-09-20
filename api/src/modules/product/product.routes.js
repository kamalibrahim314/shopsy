import { Router } from "express";
import {
    getProducts,
    getProductByIdOrSlug,
    createProduct,
    updateProduct,
    deleteProduct,
} from "./product.controller.js";
import {
    productQuerySchema,
    createProductSchema,
    updateProductSchema,
} from "./product.validation.js";
import { validate } from "../../middleware/validation.middleware.js";
import { protect, restrictTo } from "../../middleware/auth.middleware.js";
import { upload } from "../../middleware/upload.middleware.js";

const productRouter = Router();

productRouter.get("/", validate(productQuerySchema), getProducts);
productRouter.get("/:idOrSlug", getProductByIdOrSlug);

productRouter.post(
    "/",
    protect,
    restrictTo("admin"),
    upload.array("images", 5),
    validate(createProductSchema),
    createProduct
);

productRouter.put(
    "/:id",
    protect,
    restrictTo("admin"),
    upload.array("images", 5),
    validate(updateProductSchema),
    updateProduct
);

productRouter.delete("/:id", protect, restrictTo("admin"), deleteProduct);

export default productRouter;
