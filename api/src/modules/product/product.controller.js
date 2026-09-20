import { Op } from "sequelize";
import { Product, Category } from "../../DB/models/associactions.js";
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

export const getProducts = catchAsync(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const offset = (page - 1) * limit;

    const where = {};

    // Search filter
    if (req.query.search) {
        where[Op.or] = [
            { name: { [Op.like]: `%${req.query.search}%` } },
            { description: { [Op.like]: `%${req.query.search}%` } },
        ];
    }

    // Category filter (can be id or slug or name)
    if (req.query.category && req.query.category !== "all") {
        const cat = await Category.findOne({
            where: {
                [Op.or]: [
                    { id: req.query.category },
                    { slug: req.query.category },
                    { name: req.query.category },
                ],
            },
        });
        if (cat) {
            where.categoryId = cat.id;
        }
    }

    // Price range
    if (req.query.minPrice || req.query.maxPrice) {
        where.price = {};
        if (req.query.minPrice) where.price[Op.gte] = Number(req.query.minPrice);
        if (req.query.maxPrice) where.price[Op.lte] = Number(req.query.maxPrice);
    }

    // Booleans
    if (req.query.isFeatured !== undefined) {
        where.isFeatured = req.query.isFeatured === "true" || req.query.isFeatured === true;
    }
    if (req.query.isTrending !== undefined) {
        where.isTrending = req.query.isTrending === "true" || req.query.isTrending === true;
    }
    if (req.query.isTopRated !== undefined) {
        where.isTopRated = req.query.isTopRated === "true" || req.query.isTopRated === true;
    }
    if (req.query.inStock !== undefined && (req.query.inStock === "true" || req.query.inStock === true)) {
        where.stock = { [Op.gt]: 0 };
    }

    // Sorting
    let order = [["createdAt", "DESC"]];
    switch (req.query.sort) {
        case "price-asc":
            order = [["price", "ASC"]];
            break;
        case "price-desc":
            order = [["price", "DESC"]];
            break;
        case "rating":
            order = [["rating", "DESC"]];
            break;
        case "popular":
            order = [["numReviews", "DESC"]];
            break;
        default:
            order = [["createdAt", "DESC"]];
    }

    const { count, rows: products } = await Product.findAndCountAll({
        where,
        order,
        limit,
        offset,
        include: [
            {
                model: Category,
                as: "category",
                attributes: ["id", "name", "slug"],
            },
        ],
    });

    res.status(200).json({
        success: true,
        count,
        page,
        totalPages: Math.ceil(count / limit),
        products,
    });
});

export const getProductByIdOrSlug = catchAsync(async (req, res, next) => {
    const { idOrSlug } = req.params;

    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
    const where = isUUID ? { id: idOrSlug } : { slug: idOrSlug };

    const product = await Product.findOne({
        where,
        include: [
            {
                model: Category,
                as: "category",
                attributes: ["id", "name", "slug"],
            },
        ],
    });

    if (!product) {
        return next(new AppError("Product not found", 404));
    }

    res.status(200).json({
        success: true,
        product,
    });
});

export const createProduct = catchAsync(async (req, res, next) => {
    let {
        name,
        categoryId,
        description,
        price,
        discountPrice,
        stock,
        colors,
        sizes,
        images,
        isFeatured,
        isTrending,
        isTopRated,
    } = req.body;

    // Verify category exists
    const category = await Category.findByPk(categoryId);
    if (!category) {
        return next(new AppError("Invalid category specified", 400));
    }

    // Parse JSON fields if received as strings
    if (typeof colors === "string") {
        try { colors = JSON.parse(colors); } catch { colors = colors.split(",").map(s => s.trim()); }
    }
    if (typeof sizes === "string") {
        try { sizes = JSON.parse(sizes); } catch { sizes = sizes.split(",").map(s => s.trim()); }
    }
    if (typeof images === "string") {
        try { images = JSON.parse(images); } catch { images = [images]; }
    }
    images = images || [];

    // Upload files if any attached
    if (req.files && req.files.length > 0) {
        for (const file of req.files) {
            const uploadResult = await uploadToCloudinary(file.buffer, "shopsy/products");
            images.push(uploadResult.secure_url);
        }
    }

    let slug = slugify(name);
    let count = 1;
    while (await Product.findOne({ where: { slug } })) {
        slug = `${slugify(name)}-${count++}`;
    }

    const product = await Product.create({
        name,
        slug,
        categoryId,
        description,
        price: Number(price),
        discountPrice: discountPrice ? Number(discountPrice) : null,
        stock: Number(stock || 0),
        colors: colors || [],
        sizes: sizes || [],
        images,
        isFeatured: Boolean(isFeatured),
        isTrending: Boolean(isTrending),
        isTopRated: Boolean(isTopRated),
    });

    res.status(201).json({
        success: true,
        message: "Product created successfully",
        product,
    });
});

export const updateProduct = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findByPk(id);

    if (!product) {
        return next(new AppError("Product not found", 404));
    }

    let { colors, sizes, images } = req.body;

    if (colors && typeof colors === "string") {
        try { req.body.colors = JSON.parse(colors); } catch { req.body.colors = colors.split(",").map(s => s.trim()); }
    }
    if (sizes && typeof sizes === "string") {
        try { req.body.sizes = JSON.parse(sizes); } catch { req.body.sizes = sizes.split(",").map(s => s.trim()); }
    }
    if (images && typeof images === "string") {
        try { req.body.images = JSON.parse(images); } catch { req.body.images = [images]; }
    }

    let currentImages = req.body.images || product.images || [];

    // Upload files if any attached
    if (req.files && req.files.length > 0) {
        for (const file of req.files) {
            const uploadResult = await uploadToCloudinary(file.buffer, "shopsy/products");
            currentImages.push(uploadResult.secure_url);
        }
        req.body.images = currentImages;
    }

    if (req.body.name && req.body.name !== product.name) {
        req.body.slug = slugify(req.body.name);
    }

    await product.update(req.body);

    res.status(200).json({
        success: true,
        message: "Product updated successfully",
        product,
    });
});

export const deleteProduct = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findByPk(id);

    if (!product) {
        return next(new AppError("Product not found", 404));
    }

    await product.destroy();

    res.status(200).json({
        success: true,
        message: "Product deleted successfully",
    });
});
