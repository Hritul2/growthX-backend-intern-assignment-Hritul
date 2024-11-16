import { Router } from "express";

const userRouter = Router();

userRouter.post("/register");
userRouter.post("/login");
userRouter.get("/upload");
userRouter.get("/admins");

export { userRouter };
