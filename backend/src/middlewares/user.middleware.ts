import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { ApiError } from "@/utils/ApiError";
import { userTokenSchema } from "@/utils/types/user.type";

const USER_JWT_SECRET = String(process.env.USER_JWT_SECRET) || "secret";

export const protectUserRoute = (req: Request, res: Response, next: any) => {
  const token = req.cookies["user-token"];
  if (!token) {
    throw new ApiError(401, "Not authenticated, token missing");
  }

  const { success, error, data } = userTokenSchema.safeParse(
    jwt.verify(token, USER_JWT_SECRET)
  );
  if (error) {
    throw new ApiError(401, "Invalid token");
  }
  if (!data) {
    throw new ApiError(401, "Invalid token");
  }
  req.body.userId = data.userId;
  next();
};

export const openUserRoute = (req: Request, res: Response, next: any) => {
  const token = req.cookies["user-token"];
  if (token) {
    throw new ApiError(401, "Already authenticated, token present");
  }
  next();
};
