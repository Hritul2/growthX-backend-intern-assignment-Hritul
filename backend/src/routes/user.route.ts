import { Router } from "express";

// Import user-related controllers
import {
  loginUser,
  logoutUser,
  registerUser,
  getAllAdmins,
  uploadAssignment,
  getAllAssignments,
  getAssignmentById,
  getAssignmentByStatus,
} from "@/controllers/user.controller";

// Import middlewares for route protection
import { openUserRoute, protectUserRoute } from "@/middlewares/user.middleware";

const userRouter = Router();

/**
 * @swagger
 * /api/v1/user/register:
 *   post:
 *     tags:
 *       - User
 *     summary: Register a new user
 *     description: Register a new user with email, password, and name.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *               name:
 *                 type: string
 *                 example: John Doe
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
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
 *                       example: user@example.com
 *                 message:
 *                   type: string
 *                   example: User Created
 *       400:
 *         description: Bad request, validation error or user already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Validation error or User already exists
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
userRouter.post("/register", openUserRoute, registerUser); // User registration

/**
 * @swagger
 * /api/v1/user/login:
 *   post:
 *     summary: User login
 *     description: Authenticate a user with email and password. If successful, a JWT token is set in an HTTP-only cookie.
 *     tags:
 *      - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *                 description: The user's email address.
 *               password:
 *                 type: string
 *                 format: password
 *                 example: P@ssw0rd!
 *                 description: The user's password.
 *     responses:
 *       200:
 *         description: User successfully logged in.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: User Logged In
 *                 data:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: John Doe
 *                     email:
 *                       type: string
 *                       example: user@example.com
 *       400:
 *         description: Validation error or missing data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Data not Found
 *       401:
 *         description: Invalid credentials or user already authenticated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: Invalid Credentials
 */
userRouter.post("/login", openUserRoute, loginUser); // User login

/**
 * Protected routes
 * Routes that require user authentication
 */

// Assignment-related routes
userRouter.post("/upload", protectUserRoute, uploadAssignment); // Upload an assignment
userRouter.get("/assignment", protectUserRoute, getAllAssignments); // Get all assignments
userRouter.get("/assignment/:id", protectUserRoute, getAssignmentById); // Get a specific assignment by ID
userRouter.get(
  "/assignments/:assignmentId/:status",
  protectUserRoute,
  getAssignmentByStatus // Get assignments by ID and status (e.g., submitted, graded)
);

// Admin-related routes
userRouter.get("/admins", protectUserRoute, getAllAdmins); // Get all admins

/**
 * @swagger
 * /api/v1/user/logout:
 *   post:
 *     summary: User logout
 *     description: Logs out the authenticated user by clearing the JWT token stored in the cookie.
 *     tags: [User]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       description: No request body is required for logout.
 *       required: false
 *     responses:
 *       200:
 *         description: User successfully logged out.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: User Logged Out
 *                 data:
 *                   type: object
 *                   example: {}
 *       401:
 *         description: User is not authenticated or token is invalid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: Not authenticated, token missing
 */
userRouter.post("/logout", protectUserRoute, logoutUser); // User logout

export { userRouter };
