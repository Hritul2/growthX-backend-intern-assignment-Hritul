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

adminRouter.post("/register", openAdminRoute, registerAdmin);
adminRouter.post("/login", openAdminRoute, loginAdmin);

adminRouter.get("/assignments", protectAdminRoute, getAllAssignments);

adminRouter.post(
  "/assignments/:id/accept",
  protectAdminRoute,
  acceptAssignment
);

adminRouter.post(
  "/assignments/:id/reject",
  protectAdminRoute,
  rejectAssignment
);

// extra routes apart from the assignment
adminRouter.post("/logout", protectAdminRoute, logoutAdmin);
adminRouter.post("/assignment", protectAdminRoute, addAssignment);
adminRouter.get("/assignments/:id", protectAdminRoute, getAssignmentById);
adminRouter.get("/submissons", protectAdminRoute, getAllSubmissions);
adminRouter.get("/submissons/:id", protectAdminRoute, getSubmissonById);
adminRouter.get(
  "/submissons/:assignmentId/:status",
  protectAdminRoute,
  getSubmissonByStatus
);

export { adminRouter };
