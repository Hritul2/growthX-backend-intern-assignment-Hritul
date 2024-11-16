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
  acceptAssignmentSchema,
  rejectAssignmentSchema,
  addAssignmentSchema,
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

export const getAllAssignments = asyncHandler(
  async (req: Request, res: Response) => {
    const { adminId } = req.body;

    // Validate adminId
    if (!adminId) {
      res.status(400).json({ message: "Admin ID is required." });
      return;
    }

    // Fetch assignments with submissions
    const assignments = await db.assignment.findMany({
      where: { adminId },
      select: {
        task: true,
        description: true,
        dueDate: true,
        submissions: {
          select: {
            id: true,
            submittedAt: true,
            submitText: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    // Return the assignments
    res
      .status(200)
      .json(
        new ApiResponse(200, assignments, "Assignments fetched successfully")
      );
  }
);

export const acceptAssignment = asyncHandler(
  async (req: Request, res: Response) => {
    const assignmentId = String(req.params.id);
    const { success, error, data } = acceptAssignmentSchema.safeParse(req.body);

    // Validate the request body
    if (!success || error) {
      console.error("Validation error:", error?.message);
      throw new ApiError(400, error?.message || "Invalid request data.");
    }

    if (!data) {
      console.error("No data found in request body");
      throw new ApiError(400, "Data not found.");
    }

    const { userId, adminId, feedback } = data;

    // Fetch the assignment to ensure the admin is authorized
    const assignment = await db.assignment.findFirst({
      where: {
        id: assignmentId,
        adminId, // Ensure the admin is the one who created the assignment
      },
    });

    if (!assignment) {
      console.error("Assignment not found or unauthorized access.");
      throw new ApiError(403, "Unauthorized or assignment not found.");
    }

    // Fetch the specific submission
    const submission = await db.assignmentSubmission.findFirst({
      where: {
        assignmentId,
        userId,
      },
    });

    if (!submission) {
      console.error("Submission not found.");
      throw new ApiError(404, "Submission not found.");
    }

    // Update the submission status to ACCEPTED
    const updatedSubmission = await db.assignmentSubmission.update({
      where: {
        id: submission.id,
      },
      data: {
        status: "ACCEPTED", // Update status to ACCEPTED
        feedback: feedback || "No feedback provided", // Add feedback
      },
    });
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          updatedSubmission,
          "Assignment submission accepted successfully."
        )
      );
  }
);

export const rejectAssignment = asyncHandler(
  async (req: Request, res: Response) => {
    const assignmentId = String(req.params.id);
    const { success, error, data } = rejectAssignmentSchema.safeParse(req.body);

    // Validate the request body
    if (!success || error) {
      console.error("Validation error:", error?.message);
      throw new ApiError(400, error?.message || "Invalid request data.");
    }

    if (!data) {
      console.error("No data found in request body");
      throw new ApiError(400, "Data not found.");
    }

    const { userId, adminId, feedback } = data;

    // Fetch the assignment to ensure the admin is authorized
    const assignment = await db.assignment.findFirst({
      where: {
        id: assignmentId,
        adminId, // Ensure the admin is the one who created the assignment
      },
    });

    if (!assignment) {
      console.error("Assignment not found or unauthorized access.");
      throw new ApiError(403, "Unauthorized or assignment not found.");
    }

    // Fetch the specific submission
    const submission = await db.assignmentSubmission.findFirst({
      where: {
        assignmentId,
        userId,
      },
    });

    if (!submission) {
      console.error("Submission not found.");
      throw new ApiError(404, "Submission not found.");
    }

    // Update the submission status to REJECTED
    const updatedSubmission = await db.assignmentSubmission.update({
      where: {
        id: submission.id,
      },
      data: {
        status: "REJECTED", // Update status to REJECTED
        feedback: feedback || "No feedback provided", // Add feedback if available
      },
    });

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          updatedSubmission,
          "Assignment submission rejected successfully."
        )
      );
  }
);

// extra routes apart from the assignment

export const addAssignment = asyncHandler(
  async (req: Request, res: Response) => {
    const { error, success, data } = addAssignmentSchema.safeParse(req.body);
    if (error) {
      console.error("Validation error:", error.message); // Log validation error
      throw new ApiError(400, error.message);
    }
    if (!data) {
      console.error("No data found in request body"); // Log when no data is present
      throw new ApiError(400, "Data not Found");
    }
    const { adminId, task, description, dueDate } = data;
    const assignment = await db.assignment.create({
      data: {
        adminId,
        task,
        description,
        dueDate,
      },
    });
    if (!assignment) {
      console.error("Assignment not created"); // Log if assignment not created
      throw new ApiError(500, "Assignment not created");
    }
    res
      .status(201)
      .json(
        new ApiResponse(201, assignment, "Assignment created successfully")
      );
  }
);
