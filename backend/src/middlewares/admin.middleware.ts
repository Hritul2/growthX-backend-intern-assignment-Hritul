import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { ApiError } from "@/utils/ApiError";
import { adminTokenSchema } from "@/utils/types/admin.type";

const ADMIN_JWT_SECRET = String(process.env.ADMIN_JWT_SECRET) || "secret";

export const protectAdminRoute = (req: Request, res: Response, next: any) => {
  const token = req.cookies["admin-token"];
  if (!token) {
    throw new ApiError(401, "Not authenticated, token missing");
  }
  const { success, error, data } = adminTokenSchema.safeParse(
    jwt.verify(token, ADMIN_JWT_SECRET)
  );
  if (error) {
    throw new ApiError(401, "Invalid token");
  }
  if (!data) {
    throw new ApiError(401, "Invalid token");
  }
  req.body.adminId = data.adminId;
  next();
};

export const openAdminRoute = (req: Request, res: Response, next: any) => {
  const token = req.cookies["admin-token"];
  if (token) {
    throw new ApiError(401, "Already authenticated, token present");
  }
  next();
};
