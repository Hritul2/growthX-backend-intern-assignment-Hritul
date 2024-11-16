import { Router } from "express";

const adminRouter = Router();

adminRouter.post("/register");
adminRouter.post("/login");
adminRouter.get("/assignments");
adminRouter.post("/assignments/:id/accept");
adminRouter.post("/assignments/:id/reject");

export { adminRouter };
