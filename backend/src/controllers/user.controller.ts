import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ApiResponse } from "@/utils/ApiResponse";
import { ApiError } from "@/utils/ApiError";
import { asyncHandler } from "@/utils/asyncHandler";
import { Request, Response } from "express";
import Db from "@/utils/db";
import {
  userLoginSchema,
  userRegisterSchema,
  uploadAssignmentSchema,
} from "@/utils/types/user.type";

// Initialize DB instance and JWT constants
const db = Db.getInstance();
const JWT_SECRET = String(process.env.USER_JWT_SECRET) || "secret";
const JWT_TOKEN_EXPIRY = String(process.env.USER_JWT_TOKEN_EXPIRY) || "1d";

// Register User Controller
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
  console.log("userID", req.body.userId);
  res.clearCookie("user-token");
  res.status(200).json(new ApiResponse(200, {}, "User Logged Out"));
});

export const getAllAdmins = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.body.userId;
    if (!userId) {
      throw new ApiError(401, "User not authenticated");
    }
    const admins = await db.admin.findMany({
      select: {
        name: true,
        email: true,
        department: true,
        assignments: {
          select: {
            id: true,
            task: true,
            description: true,
            submissions: {
              where: {
                userId: userId,
              },
              select: {
                status: true,
                submittedAt: true,
                feedback: true,
                submitText: true,
              },
            },
          },
        },
      },
    });
    if (!admins) {
      throw new ApiError(404, "No admins found");
    }
    res.status(200).json(new ApiResponse(200, admins, "All Admins"));
  }
);

export const uploadAssignment = asyncHandler(
  async (req: Request, res: Response) => {
    const { success, error, data } = uploadAssignmentSchema.safeParse(req.body);
    if (!success || error) {
      throw new ApiError(400, error?.message || "Invalid data provided");
    }

    const { userId, submitText, assignmentId } = data;

    // Check if the assignment has already been submitted by the user
    const existingSubmission = await db.assignmentSubmission.findFirst({
      where: {
        userId,
        assignmentId,
      },
    });

    if (existingSubmission) {
      throw new ApiError(400, "Assignment already submitted.");
    }

    // Create the new assignment submission
    const submitAssignment = await db.assignmentSubmission.create({
      data: {
        submittedAt: new Date(),
        submitText,
        assignmentId,
        userId,
      },
    });

    res
      .status(201)
      .json(new ApiResponse(201, submitAssignment, "Assignment Submitted"));
  }
);

// extra routes apart from the assignment

export const getAllAssignments = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.body.userId;
    if (!userId) {
      throw new ApiError(401, "User not authenticated");
    }
    const assignments = await db.assignment.findMany({
      select: {
        id: true,
        task: true,
        description: true,
        submissions: {
          where: {
            userId: userId,
          },
          select: {
            status: true,
            submittedAt: true,
            feedback: true,
            submitText: true,
          },
        },
      },
    });
    if (!assignments) {
      throw new ApiError(404, "No assignments found");
    }
    res.status(200).json(new ApiResponse(200, assignments, "All Assignments"));
  }
);

export const getAssignmentById = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.body.userId;
    if (!userId) {
      throw new ApiError(401, "User not authenticated");
    }
    const assignmentId = req.params.id;
    if (!assignmentId) {
      throw new ApiError(400, "Assignment ID not provided");
    }
    const assignment = await db.assignment.findUnique({
      where: {
        id: assignmentId,
      },
      select: {
        id: true,
        task: true,
        description: true,
        submissions: {
          where: {
            userId: userId,
          },
          select: {
            status: true,
            submittedAt: true,
            feedback: true,
            submitText: true,
          },
        },
      },
    });
    if (!assignment) {
      throw new ApiError(404, "Assignment not found");
    }
    res.status(200).json(new ApiResponse(200, assignment, "Assignment Found"));
  }
);

export const getAssignmentByStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId } = req.body;
    const assignmentId = String(req.params.assignmentId);
    const status = String(req.params.status).toUpperCase();
    if (!userId) {
      throw new ApiError(401, "Admin not authenticated");
    }
    if (!assignmentId) {
      throw new ApiError(400, "Assignment ID not provided");
    }
    if (
      !status ||
      !["PENDING", "SUBMITTED", "ACCEPTED", "REJECTED"].includes(status)
    ) {
      throw new ApiError(400, "Invalid or missing status.");
    }

    const submissions = await db.assignmentSubmission.findMany({
      where: {
        assignmentId,
        status: status as "PENDING" | "SUBMITTED" | "ACCEPTED" | "REJECTED",
        userId: userId,
      },
      include: {
        assignment: {
          select: {
            task: true,
            description: true,
            dueDate: true,
          },
        },
      },
    });
    // If no submissions found, return a helpful message
    if (!submissions.length) {
      throw new ApiError(404, "No submissions found for the given status.");
    }

    // Send response
    res
      .status(200)
      .json(new ApiResponse(200, submissions, "Submissions found."));
  }
);
