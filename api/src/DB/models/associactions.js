import { User } from "./user.model.js";
import { Address } from "./address.model.js";
import { Category } from "./category.model.js";
import { Product } from "./product.model.js";
import { Cart } from "./cart.model.js";
import { CartItem } from "./cartItem.model.js";
import { Order } from "./order.model.js";
import { OrderItem } from "./orderItem.model.js";

// User <-> Address
User.hasMany(Address, { foreignKey: "userId", as: "addresses", onDelete: "CASCADE" });
Address.belongsTo(User, { foreignKey: "userId", as: "user" });

// User <-> Cart
User.hasOne(Cart, { foreignKey: "userId", as: "cart", onDelete: "CASCADE" });
Cart.belongsTo(User, { foreignKey: "userId", as: "user" });

// Cart <-> CartItem
Cart.hasMany(CartItem, { foreignKey: "cartId", as: "items", onDelete: "CASCADE" });
CartItem.belongsTo(Cart, { foreignKey: "cartId", as: "cart" });

// Product <-> CartItem
Product.hasMany(CartItem, { foreignKey: "productId", as: "cartItems", onDelete: "CASCADE" });
CartItem.belongsTo(Product, { foreignKey: "productId", as: "product" });

// Category <-> Product
Category.hasMany(Product, { foreignKey: "categoryId", as: "products", onDelete: "CASCADE" });
Product.belongsTo(Category, { foreignKey: "categoryId", as: "category" });

// User <-> Order
User.hasMany(Order, { foreignKey: "userId", as: "orders", onDelete: "CASCADE" });
Order.belongsTo(User, { foreignKey: "userId", as: "user" });

// Order <-> OrderItem
Order.hasMany(OrderItem, { foreignKey: "orderId", as: "items", onDelete: "CASCADE" });
OrderItem.belongsTo(Order, { foreignKey: "orderId", as: "order" });

// Product <-> OrderItem
Product.hasMany(OrderItem, { foreignKey: "productId", as: "orderItems" });
OrderItem.belongsTo(Product, { foreignKey: "productId", as: "product" });

export {
    User,
    Address,
    Category,
    Product,
    Cart,
    CartItem,
    Order,
    OrderItem,
};
