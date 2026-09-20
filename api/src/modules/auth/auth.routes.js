import { Router } from "express";
import { register, login, logout, getMe, updatePassword } from "./auth.controller.js";
import { registerSchema, loginSchema, updatePasswordSchema } from "./auth.validation.js";
import { validate } from "../../middleware/validation.middleware.js";
import { protect } from "../../middleware/auth.middleware.js";

const authRouter = Router();

authRouter.post("/register", validate(registerSchema), register);
authRouter.post("/login", validate(loginSchema), login);
authRouter.post("/logout", logout);
authRouter.get("/me", protect, getMe);
authRouter.put("/update-password", protect, validate(updatePasswordSchema), updatePassword);

export default authRouter;