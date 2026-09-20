import { Router } from "express";
import {
    getCategories,
    getCategoryByIdOrSlug,
    createCategory,
    updateCategory,
    deleteCategory,
} from "./category.controller.js";
import { categorySchema, updateCategorySchema } from "./category.validation.js";
import { validate } from "../../middleware/validation.middleware.js";
import { protect, restrictTo } from "../../middleware/auth.middleware.js";
import { upload } from "../../middleware/upload.middleware.js";

const categoryRouter = Router();

categoryRouter.get("/", getCategories);
categoryRouter.get("/:idOrSlug", getCategoryByIdOrSlug);

categoryRouter.post(
    "/",
    protect,
    restrictTo("admin"),
    upload.single("image"),
    validate(categorySchema),
    createCategory
);

categoryRouter.put(
    "/:id",
    protect,
    restrictTo("admin"),
    upload.single("image"),
    validate(updateCategorySchema),
    updateCategory
);

categoryRouter.delete("/:id", protect, restrictTo("admin"), deleteCategory);

export default categoryRouter;
