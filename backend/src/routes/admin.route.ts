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

/**
 * @swagger
 * /api/v1/admin/register:
 *   post:
 *     summary: Register a new admin
 *     tags: [Admin]
 *     description: Registers a new admin account and returns a token in a cookie if successful. Make sure the department is valid. {  HR, IT, FINANCE, MARKETING}
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Full name of the admin.
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 description: Email address of the admin.
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 description: Password for the admin account.
 *                 example: SecurePassword123
 *               department:
 *                 type: string
 *                 description: Department the admin belongs to.
 *                 example: IT
 *     responses:
 *       201:
 *         description: Admin registered successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 201
 *                 data:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: John Doe
 *                     email:
 *                       type: string
 *                       example: admin@example.com
 *                     department:
 *                       type: string
 *                       example: IT
 *                 message:
 *                   type: string
 *                   example: Admin registered successfully
 *       400:
 *         description: Bad Request - Validation error or Admin already exists.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 400
 *                 error:
 *                   type: string
 *                   example: Admin already exists
 *       401:
 *         description: Unauthorized - Token already present.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 401
 *                 error:
 *                   type: string
 *                   example: Already authenticated, token present
 */
adminRouter.post("/register", openAdminRoute, registerAdmin); // Admin registration
/**
 * @swagger
 * /api/v1/admin/login:
 *   post:
 *     summary: Login an existing admin
 *     tags: [Admin]
 *     description: Logs in an existing admin and returns a token in a cookie if successful.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email address of the admin.
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 description: Password for the admin account.
 *                 example: SecurePassword123
 *     responses:
 *       200:
 *         description: Admin logged in successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: John Doe
 *                     email:
 *                       type: string
 *                       example: admin@example.com
 *                     department:
 *                       type: string
 *                       example: IT
 *                 message:
 *                   type: string
 *                   example: Admin logged in successfully
 *       400:
 *         description: Bad Request - Validation error or missing data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 400
 *                 error:
 *                   type: string
 *                   example: Data not Found
 *       401:
 *         description: Unauthorized - Invalid password or already authenticated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 401
 *                 error:
 *                   type: string
 *                   example: Invalid password
 *       404:
 *         description: Not Found - Admin not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 404
 *                 error:
 *                   type: string
 *                   example: Admin not found
 */
adminRouter.post("/login", openAdminRoute, loginAdmin); // Admin login

/**
 * Protected routes
 * Routes that require admin authentication
 */

// Assignment management routes
adminRouter.get("/assignments", protectAdminRoute, getAllAssignments); // Get all assignments
adminRouter.post("/assignment", protectAdminRoute, addAssignment); // Add a new assignment
adminRouter.get("/assignments/:id", protectAdminRoute, getAssignmentById); // Get a specific assignment by ID
adminRouter.post(
  "/assignments/:id/accept",
  protectAdminRoute,
  acceptAssignment // Accept an assignment
);
adminRouter.post(
  "/assignments/:id/reject",
  protectAdminRoute,
  rejectAssignment // Reject an assignment
);

// Submission management routes
adminRouter.get("/submissons", protectAdminRoute, getAllSubmissions); // Get all submissions
adminRouter.get("/submissons/:id", protectAdminRoute, getSubmissonById); // Get a specific submission by ID
adminRouter.get(
  "/submissons/:assignmentId/:status",
  protectAdminRoute,
  getSubmissonByStatus // Get submissions by assignment ID and status (e.g., pending, approved)
);
/**
 * @swagger
 * /api/v1/admin/logout:
 *   post:
 *     summary: Logout the currently authenticated admin
 *     tags: [Admin]
 *     description: Logs out the admin by clearing the admin token cookie.
 *     responses:
 *       200:
 *         description: Admin logged out successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties: {}
 *                 message:
 *                   type: string
 *                   example: Admin logged out successfully
 *       401:
 *         description: Unauthorized - Token missing or invalid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 401
 *                 error:
 *                   type: string
 *                   example: Not authenticated, token missing
 */
adminRouter.post("/logout", protectAdminRoute, logoutAdmin); // Admin logout

export { adminRouter };
