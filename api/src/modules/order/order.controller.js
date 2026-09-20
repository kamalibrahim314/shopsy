import { sequelize } from "../../DB/DBConnection.js";
import {
    Order,
    OrderItem,
    Cart,
    CartItem,
    Product,
    Address,
    User,
} from "../../DB/models/associactions.js";
import { AppError } from "../../utils/appError.js";
import { catchAsync } from "../../utils/catchAsync.js";

const generateOrderNumber = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(100 + Math.random() * 900);
    return `SHP-${timestamp}-${random}`;
};

export const createOrder = catchAsync(async (req, res, next) => {
    const { addressId, shippingAddress: customAddress, paymentMethod = "cod", directItem } = req.body;

    // 1. Resolve Shipping Address
    let finalShippingAddress = customAddress;
    if (addressId) {
        const addr = await Address.findOne({
            where: { id: addressId, userId: req.user.id },
        });
        if (!addr) {
            return next(new AppError("Selected address not found", 404));
        }
        finalShippingAddress = {
            fullName: addr.fullName,
            phone: addr.phone,
            street: addr.street,
            city: addr.city,
            state: addr.state,
            postalCode: addr.postalCode,
            country: addr.country,
        };
    }

    if (!finalShippingAddress) {
        return next(new AppError("Please provide a valid shipping address", 400));
    }

    // 2. Resolve Items & Validate Stock
    let orderItemsData = [];
    let isFromCart = false;

    if (directItem) {
        const product = await Product.findByPk(directItem.productId);
        if (!product) {
            return next(new AppError("Product not found", 404));
        }
        if (product.stock < directItem.quantity) {
            return next(
                new AppError(
                    `Insufficient stock for "${product.name}". Available: ${product.stock}`,
                    400
                )
            );
        }
        const activePrice = product.discountPrice || product.price;
        orderItemsData.push({
            product,
            productId: product.id,
            name: product.name,
            image: (product.images && product.images[0]) || null,
            price: Number(activePrice),
            quantity: Number(directItem.quantity),
            size: directItem.size || null,
            color: directItem.color || null,
        });
    } else {
        isFromCart = true;
        const cart = await Cart.findOne({ where: { userId: req.user.id } });
        if (!cart) {
            return next(new AppError("Cart is empty", 400));
        }

        const cartItems = await CartItem.findAll({
            where: { cartId: cart.id },
            include: [{ model: Product, as: "product" }],
        });

        if (!cartItems || cartItems.length === 0) {
            return next(new AppError("Your cart is empty. Add products before checkout.", 400));
        }

        for (const item of cartItems) {
            if (!item.product) {
                return next(new AppError("One of the products in your cart no longer exists.", 400));
            }
            if (item.product.stock < item.quantity) {
                return next(
                    new AppError(
                        `"${item.product.name}" is out of stock or requested quantity (${item.quantity}) exceeds stock (${item.product.stock}).`,
                        400
                    )
                );
            }

            const activePrice = item.product.discountPrice || item.product.price;
            orderItemsData.push({
                product: item.product,
                productId: item.product.id,
                name: item.product.name,
                image: (item.product.images && item.product.images[0]) || null,
                price: Number(activePrice),
                quantity: item.quantity,
                size: item.size || null,
                color: item.color || null,
            });
        }
    }

    // 3. Strict Backend Price Recalculation
    const itemsPrice = orderItemsData.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );
    const shippingPrice = itemsPrice > 500 ? 0.00 : 35.00;
    const taxPrice = Number((itemsPrice * 0.05).toFixed(2));
    const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));

    // 4. Atomic Transaction for Order Creation and Inventory Update
    const result = await sequelize.transaction(async (t) => {
        const order = await Order.create(
            {
                userId: req.user.id,
                orderNumber: generateOrderNumber(),
                status: "pending",
                paymentStatus: paymentMethod === "card" ? "paid" : "pending",
                paymentMethod,
                itemsPrice: Number(itemsPrice.toFixed(2)),
                shippingPrice: Number(shippingPrice.toFixed(2)),
                taxPrice: Number(taxPrice.toFixed(2)),
                totalPrice,
                shippingAddress: finalShippingAddress,
            },
            { transaction: t }
        );

        for (const item of orderItemsData) {
            await OrderItem.create(
                {
                    orderId: order.id,
                    productId: item.productId,
                    name: item.name,
                    image: item.image,
                    price: item.price,
                    quantity: item.quantity,
                    size: item.size,
                    color: item.color,
                },
                { transaction: t }
            );

            // Decrement product inventory
            await item.product.decrement("stock", {
                by: item.quantity,
                transaction: t,
            });
        }

        // Clear cart if ordered from cart
        if (isFromCart) {
            const cart = await Cart.findOne({
                where: { userId: req.user.id },
                transaction: t,
            });
            if (cart) {
                await CartItem.destroy({
                    where: { cartId: cart.id },
                    transaction: t,
                });
            }
        }

        return order;
    });

    const fullOrder = await Order.findByPk(result.id, {
        include: [{ model: OrderItem, as: "items" }],
    });

    res.status(201).json({
        success: true,
        message: "Order placed successfully",
        order: fullOrder,
    });
});

export const getMyOrders = catchAsync(async (req, res, next) => {
    const orders = await Order.findAll({
        where: { userId: req.user.id },
        include: [
            {
                model: OrderItem,
                as: "items",
            },
        ],
        order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
        success: true,
        orders,
    });
});

export const getOrderById = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const order = await Order.findByPk(id, {
        include: [
            {
                model: OrderItem,
                as: "items",
            },
            {
                model: User,
                as: "user",
                attributes: ["id", "name", "email", "phone"],
            },
        ],
    });

    if (!order) {
        return next(new AppError("Order not found", 404));
    }

    // Check authorization: must be the owner or admin
    if (order.userId !== req.user.id && req.user.role !== "admin") {
        return next(new AppError("You are not authorized to view this order", 403));
    }

    res.status(200).json({
        success: true,
        order,
    });
});

export const getAllOrders = catchAsync(async (req, res, next) => {
    const where = {};
    if (req.query.status) {
        where.status = req.query.status;
    }

    const orders = await Order.findAll({
        where,
        include: [
            {
                model: OrderItem,
                as: "items",
            },
            {
                model: User,
                as: "user",
                attributes: ["id", "name", "email"],
            },
        ],
        order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
        success: true,
        count: orders.length,
        orders,
    });
});

export const updateOrderStatus = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { status, paymentStatus } = req.body;

    const order = await Order.findByPk(id, {
        include: [{ model: OrderItem, as: "items" }],
    });

    if (!order) {
        return next(new AppError("Order not found", 404));
    }

    // If order is transitioned to cancelled from non-cancelled, restock products
    if (status === "cancelled" && order.status !== "cancelled") {
        for (const item of order.items) {
            const product = await Product.findByPk(item.productId);
            if (product) {
                await product.increment("stock", { by: item.quantity });
            }
        }
    }

    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    await order.save();

    res.status(200).json({
        success: true,
        message: "Order updated successfully",
        order,
    });
});
