import { Router } from "express";

// import the users controller
import {
  loginUser,
  logoutUser,
  registerUser,
  getAllAdmins,
  uploadAssignment,
  getAllAssignments,
  getAssignmentById,
} from "@/controllers/user.controller";
import { openUserRoute, protectUserRoute } from "@/middlewares/user.middleware";

const userRouter = Router();

userRouter.post("/register", openUserRoute, registerUser);
userRouter.post("/login", openUserRoute, loginUser);

// protected routes
userRouter.get("/upload", protectUserRoute, uploadAssignment);
userRouter.get("/admins", protectUserRoute, getAllAdmins);

// extra routes apart from the assignment
userRouter.get("/assignment", protectUserRoute, getAllAssignments);
userRouter.get("/assignment/:id", protectUserRoute, getAssignmentById);
userRouter.post("/logout", protectUserRoute, logoutUser);

export { userRouter };
