import {
  loginAdmin,
  logoutAdmin,
  registerAdmin,
  getAllAssignments,
  acceptAssignment,
  rejectAssignment,
  addAssignment,
  getAssignmentById,
  getAllSubmissions,
  getSubmissonById,
  getSubmissonByStatus,
} from "@/controllers/admin.controller";

import {
  openAdminRoute,
  protectAdminRoute,
} from "@/middlewares/admin.middleware";
import { Router } from "express";

const adminRouter = Router();

/**
 * Public routes
 * Routes that don't require admin authentication
 */
adminRouter.post("/register", openAdminRoute, registerAdmin); // Admin registration
adminRouter.post("/login", openAdminRoute, loginAdmin); // Admin login

/**
 * Protected routes
 * Routes that require admin authentication
 */

// Assignment management routes
adminRouter.get("/assignments", protectAdminRoute, getAllAssignments); // Get all assignments
adminRouter.post("/assignment", protectAdminRoute, addAssignment); // Add a new assignment
adminRouter.get("/assignments/:id", protectAdminRoute, getAssignmentById); // Get a specific assignment by ID
adminRouter.post(
  "/assignments/:id/accept",
  protectAdminRoute,
  acceptAssignment // Accept an assignment
);
adminRouter.post(
  "/assignments/:id/reject",
  protectAdminRoute,
  rejectAssignment // Reject an assignment
);

// Submission management routes
adminRouter.get("/submissons", protectAdminRoute, getAllSubmissions); // Get all submissions
adminRouter.get("/submissons/:id", protectAdminRoute, getSubmissonById); // Get a specific submission by ID
adminRouter.get(
  "/submissons/:assignmentId/:status",
  protectAdminRoute,
  getSubmissonByStatus // Get submissions by assignment ID and status (e.g., pending, approved)
);

// Admin account management routes
adminRouter.post("/logout", protectAdminRoute, logoutAdmin); // Admin logout

export { adminRouter };
