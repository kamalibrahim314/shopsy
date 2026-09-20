import { Router } from "express";
import {
    getProfile,
    updateProfile,
    getAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    getAllUsers,
    deleteUser,
} from "./user.controller.js";
import { updateProfileSchema, addressSchema, updateAddressSchema } from "./user.validation.js";
import { validate } from "../../middleware/validation.middleware.js";
import { protect, restrictTo } from "../../middleware/auth.middleware.js";

const userRouter = Router();

userRouter.use(protect);

userRouter.get("/profile", getProfile);
userRouter.put("/profile", validate(updateProfileSchema), updateProfile);

userRouter.get("/addresses", getAddresses);
userRouter.post("/addresses", validate(addressSchema), createAddress);
userRouter.put("/addresses/:id", validate(updateAddressSchema), updateAddress);
userRouter.delete("/addresses/:id", deleteAddress);
userRouter.patch("/addresses/:id/default", setDefaultAddress);

// Admin
userRouter.get("/", restrictTo("admin"), getAllUsers);
userRouter.delete("/:id", restrictTo("admin"), deleteUser);

export default userRouter;
