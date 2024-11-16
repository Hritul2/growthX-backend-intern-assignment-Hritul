import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ApiResponse } from "@/utils/ApiResponse";
import { ApiError } from "@/utils/ApiError";
import { asyncHandler } from "@/asyncHandler";
import { Request, Response } from "express";
import Db from "@/utils/db";
import { userLoginSchema, userRegisterSchema } from "@/utils/types/user.type";

// Initialize DB instance and JWT constants
const db = Db.getInstance();
const JWT_SECRET = String(process.env.USER_JWT_SECRET) || "secret";
const JWT_TOKEN_EXPIRY = String(process.env.USER_JWT_TOKEN_EXPIRY) || "1d";

// Register User Route
export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    // Parse the request body using the userRegisterSchema
    const { data, success, error } = userRegisterSchema.safeParse(req.body);

    if (error) {
      console.error("Validation error:", error.message); // Log validation error
      throw new ApiError(400, error.message);
    }

    if (!data) {
      console.error("No data found in request body"); // Log when no data is present
      throw new ApiError(400, "Data not Found");
    }

    const { email, password, name } = data;

    // Check if the user already exists in the database

    const user = await db.user.findFirst({
      where: { email: email },
    });

    if (user) {
      console.error(`User with email ${email} already exists`); // Log if user already exists
      throw new ApiError(400, "User already exists");
    }

    // Hash the password before storing it in the database

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user in the database

    const userCreated = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    // Generate JWT token for the newly created user

    const userToken = jwt.sign({ userId: userCreated.id }, JWT_SECRET, {
      expiresIn: JWT_TOKEN_EXPIRY,
    });

    // Set the token as a cookie in the user's browser (HTTP only)

    res.cookie("user-token", userToken, { httpOnly: true });

    // Respond with success message and user details
    console.log("User created successfully");
    res.status(201).json(
      new ApiResponse(
        201,
        {
          name: userCreated.name,
          email: userCreated.email,
        },
        "User Created"
      )
    );
  }
);

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { success, error, data } = userLoginSchema.safeParse(req.body);
  if (error) {
    // Log validation error and throw an API error
    throw new ApiError(400, error.message);
  }
  if (!data) {
    // Log when no data is present
    throw new ApiError(400, "Data not Found");
  }
  const { email, password } = data;
  const user = await db.user.findFirst({
    where: { email: email },
  });
  if (!user) {
    // Log if user does not exist
    // redirect can be done here
    throw new ApiError(401, "Invalid Credentials");
  }
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw new ApiError(401, "Invalid Credentials");
  }
  const userToken = jwt.sign({ userId: user.id }, JWT_SECRET, {
    expiresIn: JWT_TOKEN_EXPIRY,
  });
  res.cookie("user-token", userToken, { httpOnly: true });
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { name: user.name, email: user.email },
        "User Logged In"
      )
    );
});

export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  res.clearCookie("user-token");
  res.status(200).json(new ApiResponse(200, {}, "User Logged Out"));
});
