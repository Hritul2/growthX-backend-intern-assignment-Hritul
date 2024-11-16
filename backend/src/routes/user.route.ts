import { Router } from "express";

// import the users controller
import {
  loginUser,
  logoutUser,
  registerUser,
} from "@/controllers/user.controller";
import { openUserRoute, protectUserRoute } from "@/middlewares/user.middleware";

const userRouter = Router();

userRouter.post("/register", openUserRoute, registerUser);
userRouter.post("/login", openUserRoute, loginUser);

// protected routes
userRouter.get("/upload", protectUserRoute);
userRouter.get("/admins", protectUserRoute);

// extra routes apart from the assignment
userRouter.post("/logout", protectUserRoute, logoutUser);

export { userRouter };
