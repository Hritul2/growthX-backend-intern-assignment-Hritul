import {
  loginAdmin,
  logoutAdmin,
  registerAdmin,
} from "@/controllers/admin.controller";
import {
  openAdminRoute,
  protectAdminRoute,
} from "@/middlewares/admin.middleware";
import { Router } from "express";

const adminRouter = Router();

adminRouter.post("/register", openAdminRoute, registerAdmin);
adminRouter.post("/login", openAdminRoute, loginAdmin);

adminRouter.get("/assignments");
adminRouter.post("/assignments/:id/accept");
adminRouter.post("/assignments/:id/reject");

// extra routes apart from the assignment
adminRouter.post("/logout", protectAdminRoute, logoutAdmin);

export { adminRouter };
