import { User, Address, Order } from "../../DB/models/associactions.js";
import { AppError } from "../../utils/appError.js";
import { catchAsync } from "../../utils/catchAsync.js";

export const getProfile = catchAsync(async (req, res, next) => {
    const user = await User.findByPk(req.user.id, {
        attributes: { exclude: ["password"] },
        include: [
            {
                model: Address,
                as: "addresses",
            },
        ],
    });

    if (!user) {
        return next(new AppError("User not found", 404));
    }

    res.status(200).json({
        success: true,
        user,
    });
});

export const updateProfile = catchAsync(async (req, res, next) => {
    const { name, phone, avatar } = req.body;
    const user = await User.findByPk(req.user.id);

    if (!user) {
        return next(new AppError("User not found", 404));
    }

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();

    const userObj = user.toJSON();
    delete userObj.password;

    res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        user: userObj,
    });
});

export const getAddresses = catchAsync(async (req, res, next) => {
    const addresses = await Address.findAll({
        where: { userId: req.user.id },
        order: [["isDefault", "DESC"], ["createdAt", "DESC"]],
    });

    res.status(200).json({
        success: true,
        addresses,
    });
});

export const createAddress = catchAsync(async (req, res, next) => {
    const { fullName, phone, street, city, state, postalCode, country, isDefault } = req.body;

    if (isDefault) {
        await Address.update(
            { isDefault: false },
            { where: { userId: req.user.id } }
        );
    }

    // Check if this is user's first address, make it default automatically
    const existingCount = await Address.count({ where: { userId: req.user.id } });
    const shouldBeDefault = isDefault || existingCount === 0;

    const address = await Address.create({
        userId: req.user.id,
        fullName,
        phone,
        street,
        city,
        state,
        postalCode,
        country: country || "Egypt",
        isDefault: shouldBeDefault,
    });

    res.status(201).json({
        success: true,
        message: "Address added successfully",
        address,
    });
});

export const updateAddress = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const address = await Address.findOne({
        where: { id, userId: req.user.id },
    });

    if (!address) {
        return next(new AppError("Address not found", 404));
    }

    if (req.body.isDefault) {
        await Address.update(
            { isDefault: false },
            { where: { userId: req.user.id } }
        );
    }

    await address.update(req.body);

    res.status(200).json({
        success: true,
        message: "Address updated successfully",
        address,
    });
});

export const deleteAddress = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const address = await Address.findOne({
        where: { id, userId: req.user.id },
    });

    if (!address) {
        return next(new AppError("Address not found", 404));
    }

    await address.destroy();

    res.status(200).json({
        success: true,
        message: "Address deleted successfully",
    });
});

export const setDefaultAddress = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const address = await Address.findOne({
        where: { id, userId: req.user.id },
    });

    if (!address) {
        return next(new AppError("Address not found", 404));
    }

    await Address.update(
        { isDefault: false },
        { where: { userId: req.user.id } }
    );

    address.isDefault = true;
    await address.save();

    res.status(200).json({
        success: true,
        message: "Default address updated",
        address,
    });
});

// Admin handlers
export const getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.findAll({
        attributes: { exclude: ["password"] },
        order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
        success: true,
        users,
    });
});

export const deleteUser = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
        return next(new AppError("User not found", 404));
    }

    await user.destroy();

    res.status(200).json({
        success: true,
        message: "User deleted successfully",
    });
});
