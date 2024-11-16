import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ApiResponse } from "@/utils/ApiResponse";
import { ApiError } from "@/utils/ApiError";
import { asyncHandler } from "@/utils/asyncHandler";
import { Request, Response } from "express";
import Db from "@/utils/db";
import {
  adminRegisterSchema,
  adminLoginSchema,
} from "@/utils/types/admin.type";

// Initialize DB instance and JWT constants
const db = Db.getInstance();
const ADMIN_JWT_SECRET = String(process.env.ADMIN_JWT_SECRET) || "secret";
const ADMIN_JWT_TOKEN_EXPIRY =
  String(process.env.ADMIN_JWT_TOKEN_EXPIRY) || "1d";

// Register Admin
export const registerAdmin = asyncHandler(
  async (req: Request, res: Response) => {
    const { data, success, error } = adminRegisterSchema.safeParse(req.body);
    if (error) {
      console.error("Validation error:", error.message); // Log validation error
      throw new ApiError(400, error.message);
    }

    if (!data) {
      console.error("No data found in request body"); // Log when no data is present
      throw new ApiError(400, "Data not Found");
    }

    const { email, password, name, department } = data;

    const admin = await db.admin.findFirst({
      where: { email: email },
    });
    if (admin) {
      console.error(`Admin with email ${email} already exists`); // Log if admin already exists
      throw new ApiError(400, "Admin already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const adminCreated = await db.admin.create({
      data: {
        email,
        password: hashedPassword,
        name,
        department,
      },
    });

    const adminToken = jwt.sign(
      { adminId: adminCreated.id },
      ADMIN_JWT_SECRET,
      {
        expiresIn: ADMIN_JWT_TOKEN_EXPIRY,
      }
    );

    res.cookie("admin-token", adminToken, { httpOnly: true });
    console.log("Admin registered successfully");
    res.status(201).json(
      new ApiResponse(
        201,
        {
          name: adminCreated.name,
          email: adminCreated.email,
          department: adminCreated.department,
        },
        "Admin registered successfully"
      )
    );
  }
);

// Login Admin
export const loginAdmin = asyncHandler(async (req: Request, res: Response) => {
  const { data, success, error } = adminLoginSchema.safeParse(req.body);
  if (error) {
    console.error("Validation error:", error.message); // Log validation error
    throw new ApiError(400, error.message);
  }
  if (!data) {
    console.error("No data found in request body"); // Log when no data is present
    throw new ApiError(400, "Data not Found");
  }
  const { email, password } = data;
  const admin = await db.admin.findFirst({
    where: { email: email },
  });
  if (!admin) {
    console.error(`Admin with email ${email} not found`); // Log if admin not found
    throw new ApiError(404, "Admin not found");
  }
  const isValidPassword = await bcrypt.compare(password, admin.password);
  if (!isValidPassword) {
    console.error("Invalid password"); // Log if password is invalid
    throw new ApiError(401, "Invalid password");
  }
  const adminToken = jwt.sign({ adminId: admin.id }, ADMIN_JWT_SECRET, {
    expiresIn: ADMIN_JWT_TOKEN_EXPIRY,
  });
  res.cookie("admin-token", adminToken, { httpOnly: true });
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { name: admin.name, email: admin.email, department: admin.department },
        "Admin logged in successfully"
      )
    );
});

export const logoutAdmin = asyncHandler(async (req: Request, res: Response) => {
  console.log("adminId", req.body.adminId);

  res.clearCookie("admin-token");
  res
    .status(200)
    .json(new ApiResponse(200, {}, "Admin logged out successfully"));
});
