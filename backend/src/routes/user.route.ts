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

/**
 * @swagger
 * /api/v1/user/upload:
 *   post:
 *     summary: Upload an assignment
 *     description: Allows an authenticated user to submit an assignment. Users cannot submit the same assignment more than once.
 *     tags: [User]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - submitText
 *               - assignmentId
 *             properties:
 *               submitText:
 *                 type: string
 *                 description: The text submission for the assignment.
 *                 example: This is my assignment submission.
 *               assignmentId:
 *                 type: integer
 *                 description: The ID of the assignment being submitted.
 *                 example: 101
 *     responses:
 *       201:
 *         description: Assignment successfully submitted.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: Assignment Submitted
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 10
 *                     submittedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2024-11-17T10:45:00.000Z
 *                     submitText:
 *                       type: string
 *                       example: This is my assignment submission.
 *                     assignmentId:
 *                       type: integer
 *                       example: 101
 *                     userId:
 *                       type: integer
 *                       example: 42
 *       400:
 *         description: Bad request, invalid data or duplicate submission.
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
 *                   example: Assignment already submitted.
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
userRouter.post("/upload", protectUserRoute, uploadAssignment); // Upload an assignment
/**
 * @swagger
 * /api/v1/user/assignment:
 *   get:
 *     summary: Get all assignments
 *     description: Fetches all assignments for the authenticated user along with their submission details (if any).
 *     tags: [User]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: A list of all assignments along with submission details for the authenticated user.
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
 *                   example: All Assignments
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: Unique ID of the assignment.
 *                         example: 101
 *                       task:
 *                         type: string
 *                         description: Title or task description of the assignment.
 *                         example: Complete the final project report.
 *                       description:
 *                         type: string
 *                         description: Detailed description of the assignment.
 *                         example: Submit a comprehensive report of the project.
 *                       submissions:
 *                         type: array
 *                         description: Submission details for this assignment by the user.
 *                         items:
 *                           type: object
 *                           properties:
 *                             status:
 *                               type: string
 *                               description: Status of the submission (e.g., pending, approved).
 *                               example: approved
 *                             submittedAt:
 *                               type: string
 *                               format: date-time
 *                               description: Date and time when the assignment was submitted.
 *                               example: 2024-11-17T10:45:00.000Z
 *                             feedback:
 *                               type: string
 *                               description: Feedback on the submission, if provided.
 *                               example: Great work!
 *                             submitText:
 *                               type: string
 *                               description: The submitted text for the assignment.
 *                               example: This is my completed assignment text.
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
 *       404:
 *         description: No assignments found for the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: No assignments found
 */
userRouter.get("/assignment", protectUserRoute, getAllAssignments); // Get all assignments
/**
 * @swagger
 * /api/v1/user/assignment/{id}:
 *   get:
 *     summary: Get a specific assignment by ID
 *     description: Fetches details of a specific assignment by its ID for the authenticated user, including submission details if available.
 *     tags: [User]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the assignment to retrieve.
 *         schema:
 *           type: integer
 *           example: 101
 *     responses:
 *       200:
 *         description: Details of the requested assignment including submission details for the authenticated user.
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
 *                   example: Assignment Found
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: Unique ID of the assignment.
 *                       example: 101
 *                     task:
 *                       type: string
 *                       description: Title or task description of the assignment.
 *                       example: Write a summary of Chapter 5.
 *                     description:
 *                       type: string
 *                       description: Detailed description of the assignment.
 *                       example: Summarize the main points of Chapter 5 in 500 words.
 *                     submissions:
 *                       type: array
 *                       description: Submission details for this assignment by the user.
 *                       items:
 *                         type: object
 *                         properties:
 *                           status:
 *                             type: string
 *                             description: Status of the submission (e.g., pending, approved).
 *                             example: pending
 *                           submittedAt:
 *                             type: string
 *                             format: date-time
 *                             description: Date and time when the assignment was submitted.
 *                             example: 2024-11-17T10:45:00.000Z
 *                           feedback:
 *                             type: string
 *                             description: Feedback on the submission, if provided.
 *                             example: Needs more details in the analysis.
 *                           submitText:
 *                             type: string
 *                             description: The submitted text for the assignment.
 *                             example: This is my summary for Chapter 5.
 *       400:
 *         description: Assignment ID is missing or invalid.
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
 *                   example: Assignment ID not provided
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
 *       404:
 *         description: Assignment not found for the given ID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: Assignment not found
 */
userRouter.get("/assignment/:id", protectUserRoute, getAssignmentById); // Get a specific assignment by ID
/**
 * @swagger
 * /api/v1/user/assignments/{assignmentId}/{status}:
 *   get:
 *     summary: Get assignments by ID and status
 *     description: Fetch all assignment submissions for a specific assignment ID and status (e.g., PENDING, SUBMITTED, ACCEPTED, REJECTED) for the authenticated user.
 *     tags: [User]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: assignmentId
 *         required: true
 *         description: ID of the assignment to retrieve submissions for.
 *         schema:
 *           type: string
 *           example: "101"
 *       - in: path
 *         name: status
 *         required: true
 *         description: Status of the submissions to retrieve.
 *         schema:
 *           type: string
 *           enum: [PENDING, SUBMITTED, ACCEPTED, REJECTED]
 *           example: "SUBMITTED"
 *     responses:
 *       200:
 *         description: List of submissions for the given assignment ID and status.
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
 *                   example: Submissions found.
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: Submission ID.
 *                         example: "submission_123"
 *                       status:
 *                         type: string
 *                         description: Current status of the submission.
 *                         example: "SUBMITTED"
 *                       submittedAt:
 *                         type: string
 *                         format: date-time
 *                         description: Date and time of the submission.
 *                         example: "2024-11-17T10:45:00.000Z"
 *                       feedback:
 *                         type: string
 *                         description: Feedback provided for the submission, if any.
 *                         example: "Well done!"
 *                       submitText:
 *                         type: string
 *                         description: Content submitted for the assignment.
 *                         example: "Here is my solution for the assignment."
 *                       assignment:
 *                         type: object
 *                         description: Details about the related assignment.
 *                         properties:
 *                           task:
 *                             type: string
 *                             description: Title or task description of the assignment.
 *                             example: "Write a summary of Chapter 5"
 *                           description:
 *                             type: string
 *                             description: Detailed description of the assignment.
 *                             example: "Summarize the main points of Chapter 5 in 500 words."
 *                           dueDate:
 *                             type: string
 *                             format: date
 *                             description: Due date for the assignment.
 *                             example: "2024-11-20"
 *       400:
 *         description: Missing or invalid parameters (e.g., assignment ID or status).
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
 *                   example: Invalid or missing status.
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
 *                   example: Not authenticated, token missing.
 *       404:
 *         description: No submissions found for the given status.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: No submissions found for the given status.
 */
userRouter.get(
  "/assignments/:assignmentId/:status",
  protectUserRoute,
  getAssignmentByStatus // Get assignments by ID and status (e.g., submitted, graded)
);

/**
 * @swagger
 * /api/v1/user/admins:
 *   get:
 *     summary: Get all admins
 *     description: Retrieve a list of all admins along with their assignments and related submissions for the authenticated user.
 *     tags: [User]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of all admins with assignments and submissions.
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
 *                   example: All Admins
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         description: Name of the admin.
 *                         example: "John Doe"
 *                       email:
 *                         type: string
 *                         description: Email address of the admin.
 *                         example: "john.doe@example.com"
 *                       department:
 *                         type: string
 *                         description: Department of the admin.
 *                         example: "Computer Science"
 *                       assignments:
 *                         type: array
 *                         description: List of assignments managed by the admin.
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                               description: Assignment ID.
 *                               example: "assignment_123"
 *                             task:
 *                               type: string
 *                               description: Title or task description of the assignment.
 *                               example: "Create a database schema"
 *                             description:
 *                               type: string
 *                               description: Detailed description of the assignment.
 *                               example: "Design a normalized database schema for an e-commerce application."
 *                             submissions:
 *                               type: array
 *                               description: Submissions related to the assignment.
 *                               items:
 *                                 type: object
 *                                 properties:
 *                                   status:
 *                                     type: string
 *                                     description: Submission status.
 *                                     example: "SUBMITTED"
 *                                   submittedAt:
 *                                     type: string
 *                                     format: date-time
 *                                     description: Submission date and time.
 *                                     example: "2024-11-17T10:45:00.000Z"
 *                                   feedback:
 *                                     type: string
 *                                     description: Feedback provided for the submission.
 *                                     example: "Good work!"
 *                                   submitText:
 *                                     type: string
 *                                     description: Text submitted for the assignment.
 *                                     example: "My solution for the database schema task."
 *       401:
 *         description: User not authenticated or token is invalid.
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
 *                   example: Not authenticated, token missing.
 *       404:
 *         description: No admins found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: No admins found.
 */
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
