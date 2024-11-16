import {
  loginAdmin,
  logoutAdmin,
  registerAdmin,
  getAllAssignments,
  acceptAssignment,
  rejectAssignment,
  addAssignment,
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

adminRouter.post("/create-assignment", protectAdminRoute, addAssignment);

// extra routes apart from the assignment
adminRouter.post("/logout", protectAdminRoute, logoutAdmin);

export { adminRouter };
