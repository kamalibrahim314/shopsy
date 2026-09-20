import { Category, Product } from "../../DB/models/associactions.js";
import { AppError } from "../../utils/appError.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { uploadToCloudinary } from "../../services/cloudinary.service.js";

const slugify = (text) =>
    text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "")
        .replace(/--+/g, "-");

export const getCategories = catchAsync(async (req, res, next) => {
    const categories = await Category.findAll({
        order: [["name", "ASC"]],
    });

    res.status(200).json({
        success: true,
        categories,
    });
});

export const getCategoryByIdOrSlug = catchAsync(async (req, res, next) => {
    const { idOrSlug } = req.params;

    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
    const where = isUUID ? { id: idOrSlug } : { slug: idOrSlug };

    const category = await Category.findOne({
        where,
        include: [
            {
                model: Product,
                as: "products",
            },
        ],
    });

    if (!category) {
        return next(new AppError("Category not found", 404));
    }

    res.status(200).json({
        success: true,
        category,
    });
});

export const createCategory = catchAsync(async (req, res, next) => {
    const { name, description } = req.body;
    let imageUrl = req.body.image || null;

    if (req.file) {
        const uploadResult = await uploadToCloudinary(req.file.buffer, "shopsy/categories");
        imageUrl = uploadResult.secure_url;
    }

    const slug = req.body.slug ? slugify(req.body.slug) : slugify(name);

    const existingCategory = await Category.findOne({ where: { slug } });
    if (existingCategory) {
        return next(new AppError("A category with this name or slug already exists", 400));
    }

    const category = await Category.create({
        name,
        slug,
        description,
        image: imageUrl,
    });

    res.status(201).json({
        success: true,
        message: "Category created successfully",
        category,
    });
});

export const updateCategory = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const category = await Category.findByPk(id);

    if (!category) {
        return next(new AppError("Category not found", 404));
    }

    if (req.body.name && !req.body.slug) {
        req.body.slug = slugify(req.body.name);
    }

    if (req.file) {
        const uploadResult = await uploadToCloudinary(req.file.buffer, "shopsy/categories");
        req.body.image = uploadResult.secure_url;
    }

    await category.update(req.body);

    res.status(200).json({
        success: true,
        message: "Category updated successfully",
        category,
    });
});

export const deleteCategory = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const category = await Category.findByPk(id);

    if (!category) {
        return next(new AppError("Category not found", 404));
    }

    await category.destroy();

    res.status(200).json({
        success: true,
        message: "Category deleted successfully",
    });
});
