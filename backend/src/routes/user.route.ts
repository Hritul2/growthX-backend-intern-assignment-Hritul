import { Router } from "express";

// Import user-related controllers
import {
  loginUser,
  logoutUser,
  registerUser,
  getAllAdmins,
  uploadAssignment,
  getAllAssignments,
  getAssignmentById,
  getAssignmentByStatus,
} from "@/controllers/user.controller";

// Import middlewares for route protection
import { openUserRoute, protectUserRoute } from "@/middlewares/user.middleware";

const userRouter = Router();

/**
 * Public routes
 * Routes that don't require user authentication
 */
userRouter.post("/register", openUserRoute, registerUser); // User registration
userRouter.post("/login", openUserRoute, loginUser); // User login

/**
 * Protected routes
 * Routes that require user authentication
 */

// Assignment-related routes
userRouter.post("/upload", protectUserRoute, uploadAssignment); // Upload an assignment
userRouter.get("/assignment", protectUserRoute, getAllAssignments); // Get all assignments
userRouter.get("/assignment/:id", protectUserRoute, getAssignmentById); // Get a specific assignment by ID
userRouter.get(
  "/assignments/:assignmentId/:status",
  protectUserRoute,
  getAssignmentByStatus // Get assignments by ID and status (e.g., submitted, graded)
);

// Admin-related routes
userRouter.get("/admins", protectUserRoute, getAllAdmins); // Get all admins

// Logout route
userRouter.post("/logout", protectUserRoute, logoutUser); // User logout

export { userRouter };
