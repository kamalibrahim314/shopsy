import { Cart, CartItem, Product, Category } from "../../DB/models/associactions.js";
import { AppError } from "../../utils/appError.js";
import { catchAsync } from "../../utils/catchAsync.js";

// Helper to get or create cart for user
const getOrCreateUserCart = async (userId) => {
    let [cart] = await Cart.findOrCreate({
        where: { userId },
    });
    return cart;
};

// Helper to calculate totals and format cart
const formatCartResponse = async (cartId) => {
    const items = await CartItem.findAll({
        where: { cartId },
        include: [
            {
                model: Product,
                as: "product",
                attributes: ["id", "name", "slug", "price", "discountPrice", "stock", "images"],
            },
        ],
        order: [["createdAt", "DESC"]],
    });

    let totalItems = 0;
    let totalPrice = 0;

    const formattedItems = items.map((item) => {
        const itemPrice = item.product?.discountPrice || item.product?.price || item.price;
        const lineTotal = Number(itemPrice) * item.quantity;
        totalItems += item.quantity;
        totalPrice += lineTotal;

        return {
            id: item.id,
            productId: item.productId,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
            price: Number(itemPrice),
            lineTotal: Number(lineTotal.toFixed(2)),
            product: item.product,
            isAvailable: item.product ? item.product.stock >= item.quantity : false,
            availableStock: item.product ? item.product.stock : 0,
        };
    });

    return {
        id: cartId,
        items: formattedItems,
        totalItems,
        totalPrice: Number(totalPrice.toFixed(2)),
    };
};

export const getCart = catchAsync(async (req, res, next) => {
    const cart = await getOrCreateUserCart(req.user.id);
    const cartData = await formatCartResponse(cart.id);

    res.status(200).json({
        success: true,
        cart: cartData,
    });
});

export const addToCart = catchAsync(async (req, res, next) => {
    const { productId, quantity = 1, size = null, color = null } = req.body;

    const product = await Product.findByPk(productId);
    if (!product) {
        return next(new AppError("Product not found", 404));
    }

    if (product.stock <= 0) {
        return next(new AppError("Product is out of stock", 400));
    }

    const cart = await getOrCreateUserCart(req.user.id);

    // Check if matching item already in cart
    const existingItem = await CartItem.findOne({
        where: {
            cartId: cart.id,
            productId,
            size: size || null,
            color: color || null,
        },
    });

    const activePrice = product.discountPrice || product.price;

    if (existingItem) {
        const newQuantity = existingItem.quantity + Number(quantity);
        if (newQuantity > product.stock) {
            return next(
                new AppError(
                    `Cannot add more. Only ${product.stock} items available in stock.`,
                    400
                )
            );
        }
        existingItem.quantity = newQuantity;
        existingItem.price = activePrice;
        await existingItem.save();
    } else {
        if (Number(quantity) > product.stock) {
            return next(
                new AppError(
                    `Requested quantity exceeds available stock (${product.stock}).`,
                    400
                )
            );
        }

        await CartItem.create({
            cartId: cart.id,
            productId,
            quantity: Number(quantity),
            size,
            color,
            price: activePrice,
        });
    }

    const cartData = await formatCartResponse(cart.id);

    res.status(200).json({
        success: true,
        message: "Product added to cart",
        cart: cartData,
    });
});

export const updateQuantity = catchAsync(async (req, res, next) => {
    const { itemId } = req.params;
    const { quantity } = req.body;

    const cart = await getOrCreateUserCart(req.user.id);
    const item = await CartItem.findOne({
        where: { id: itemId, cartId: cart.id },
        include: [{ model: Product, as: "product" }],
    });

    if (!item) {
        return next(new AppError("Item not found in cart", 404));
    }

    if (quantity > item.product.stock) {
        return next(
            new AppError(
                `Requested quantity exceeds available stock (${item.product.stock}).`,
                400
            )
        );
    }

    item.quantity = Number(quantity);
    await item.save();

    const cartData = await formatCartResponse(cart.id);

    res.status(200).json({
        success: true,
        message: "Cart updated",
        cart: cartData,
    });
});

export const removeFromCart = catchAsync(async (req, res, next) => {
    const { itemId } = req.params;
    const cart = await getOrCreateUserCart(req.user.id);

    const item = await CartItem.findOne({
        where: { id: itemId, cartId: cart.id },
    });

    if (!item) {
        return next(new AppError("Item not found in cart", 404));
    }

    await item.destroy();

    const cartData = await formatCartResponse(cart.id);

    res.status(200).json({
        success: true,
        message: "Item removed from cart",
        cart: cartData,
    });
});

export const clearCart = catchAsync(async (req, res, next) => {
    const cart = await getOrCreateUserCart(req.user.id);
    await CartItem.destroy({ where: { cartId: cart.id } });

    res.status(200).json({
        success: true,
        message: "Cart cleared",
        cart: {
            id: cart.id,
            items: [],
            totalItems: 0,
            totalPrice: 0,
        },
    });
});

export const validateCartStock = catchAsync(async (req, res, next) => {
    const cart = await getOrCreateUserCart(req.user.id);
    const cartData = await formatCartResponse(cart.id);

    const issues = [];
    for (const item of cartData.items) {
        if (!item.isAvailable) {
            issues.push({
                itemId: item.id,
                name: item.product?.name || "Product",
                requestedQuantity: item.quantity,
                availableStock: item.availableStock,
            });
        }
    }

    res.status(200).json({
        success: true,
        isValid: issues.length === 0,
        issues,
        cart: cartData,
    });
});
