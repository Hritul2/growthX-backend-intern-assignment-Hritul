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
/**
 * @swagger
 * /api/v1/admin/assignments:
 *   get:
 *     summary: Get all assignments for the authenticated admin assigned by them
 *     security:
 *      - cookieAuth: []
 *     components:
 *      securitySchemes:
 *       cookieAuth:
 *       type: apiKey
 *       in: cookie
 *       name: admin-token
 *     tags: [Admin]
 *     description: Fetches all assignments associated with the authenticated admin, including assignment details and submissions.
 *     responses:
 *       200:
 *         description: Successfully fetched assignments and submissions.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       task:
 *                         type: string
 *                         example: "Math Homework"
 *                       description:
 *                         type: string
 *                         example: "Complete the following exercises."
 *                       dueDate:
 *                         type: string
 *                         format: date
 *                         example: "2024-12-01"
 *                       submissions:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                               example: 1
 *                             submittedAt:
 *                               type: string
 *                               format: date-time
 *                               example: "2024-11-15T12:00:00Z"
 *                             submitText:
 *                               type: string
 *                               example: "Completed the task."
 *                             user:
 *                               type: object
 *                               properties:
 *                                 id:
 *                                   type: integer
 *                                   example: 101
 *                                 name:
 *                                   type: string
 *                                   example: "John Doe"
 *                                 email:
 *                                   type: string
 *                                   example: "johndoe@example.com"
 *       400:
 *         description: Bad Request - Admin ID is required.
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
 *                   example: "Admin ID is required."
 *       401:
 *         description: Unauthorized - Invalid or missing token.
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
 *                   example: "Not authenticated, token missing"
 */
adminRouter.get("/assignments", protectAdminRoute, getAllAssignments); // Get all assignments
/**
 * @swagger
 * /api/v1/admin/assignment:
 *   post:
 *     summary: Add a new assignment for the user
 *     security:
 *      - cookieAuth: []
 *     components:
 *      securitySchemes:
 *       cookieAuth:
 *       type: apiKey
 *       in: cookie
 *       name: admin-token
 *     tags: [Admin]
 *     description: Allows the authenticated admin to create a new assignment, including task, description, and due date.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               task:
 *                 type: string
 *                 example: "Math Homework"
 *               description:
 *                 type: string
 *                 example: "Complete the exercises on page 12."
 *               dueDate:
 *                 type: string
 *                 format: date
 *                 example: "2024-12-01"
 *     responses:
 *       201:
 *         description: Assignment created successfully.
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
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     task:
 *                       type: string
 *                       example: "Math Homework"
 *                     description:
 *                       type: string
 *                       example: "Complete the exercises on page 12."
 *                     dueDate:
 *                       type: string
 *                       format: date
 *                       example: "2024-12-01"
 *                     adminId:
 *                       type: integer
 *                       example: 1
 *                 message:
 *                   type: string
 *                   example: "Assignment created successfully"
 *       400:
 *         description: Bad Request - Validation failed or missing data.
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
 *                   example: "Validation error: Task is required."
 *       401:
 *         description: Unauthorized - Invalid or missing token.
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
 *                   example: "Not authenticated, token missing"
 *       500:
 *         description: Internal Server Error - Assignment creation failed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 error:
 *                   type: string
 *                   example: "Assignment not created"
 */
adminRouter.post("/assignment", protectAdminRoute, addAssignment); // Add a new assignment
/**
 * @swagger
 * /api/v1/admin/assignments/{id}:
 *   get:
 *     summary: Get a specific assignment by ID
 *     security:
 *      - cookieAuth: []
 *     components:
 *      securitySchemes:
 *       cookieAuth:
 *       type: apiKey
 *       in: cookie
 *       name: admin-token
 *     tags: [Admin]
 *     description: Fetches a specific assignment details by its ID, based on the authenticated admin.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the assignment to retrieve.
 *         schema:
 *           type: string
 *           example: "1"
 *     responses:
 *       200:
 *         description: Assignment fetched successfully.
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
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     task:
 *                       type: string
 *                       example: "Math Homework"
 *                     description:
 *                       type: string
 *                       example: "Complete the exercises on page 12."
 *                     dueDate:
 *                       type: string
 *                       format: date
 *                       example: "2024-12-01"
 *                     adminId:
 *                       type: integer
 *                       example: 1
 *                 message:
 *                   type: string
 *                   example: "Assignment fetched successfully"
 *       400:
 *         description: Bad Request - Missing or invalid parameters.
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
 *                   example: "Assignment ID is required."
 *       401:
 *         description: Unauthorized - Invalid or missing token.
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
 *                   example: "Not authenticated, token missing"
 *       404:
 *         description: Not Found - Assignment not found.
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
 *                   example: "Assignment not found"
 */
adminRouter.get("/assignments/:id", protectAdminRoute, getAssignmentById); // Get a specific assignment by ID
/**
 * @swagger
 * /api/v1/admin/assignments/{id}/accept:
 *   post:
 *     summary: Accept an assignment submission
 *     security:
 *      - cookieAuth: []
 *     components:
 *      securitySchemes:
 *       cookieAuth:
 *       type: apiKey
 *       in: cookie
 *       name: admin-token
 *     tags: [Admin]
 *     description: This endpoint allows an admin to accept a specific assignment submission by providing feedback.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the assignment to accept.
 *         schema:
 *           type: string
 *           example: "1"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: The ID of the user who submitted the assignment.
 *                 example: 123
 *               adminId:
 *                 type: integer
 *                 description: The ID of the admin who created the assignment.
 *                 example: 1
 *               feedback:
 *                 type: string
 *                 description: Feedback for the assignment submission.
 *                 example: "Great work, well done!"
 *     responses:
 *       200:
 *         description: Assignment submission accepted successfully.
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
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     assignmentId:
 *                       type: integer
 *                       example: 1
 *                     userId:
 *                       type: integer
 *                       example: 123
 *                     status:
 *                       type: string
 *                       example: "ACCEPTED"
 *                     feedback:
 *                       type: string
 *                       example: "Great work, well done!"
 *                 message:
 *                   type: string
 *                   example: "Assignment submission accepted successfully."
 *       400:
 *         description: Bad Request - Invalid or missing request data.
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
 *                   example: "Invalid request data."
 *       403:
 *         description: Forbidden - Unauthorized access or assignment not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 403
 *                 error:
 *                   type: string
 *                   example: "Unauthorized or assignment not found."
 *       404:
 *         description: Not Found - Submission not found.
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
 *                   example: "Submission not found."
 *       401:
 *         description: Unauthorized - Invalid or missing token.
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
 *                   example: "Not authenticated, token missing"
 */
adminRouter.post(
  "/assignments/:id/accept",
  protectAdminRoute,
  acceptAssignment // Accept an assignment
);

/**
 * @swagger
 * /api/v1/admin/assignments/{id}/reject:
 *   post:
 *     summary: Reject an assignment submission
 *     security:
 *      - cookieAuth: []
 *     components:
 *      securitySchemes:
 *       cookieAuth:
 *       type: apiKey
 *       in: cookie
 *       name: admin-token
 *     tags: [Admin]
 *     description: This endpoint allows an admin to reject a specific assignment submission by providing feedback.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the assignment to reject.
 *         schema:
 *           type: string
 *           example: "1"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: The ID of the user who submitted the assignment.
 *                 example: 123
 *               adminId:
 *                 type: integer
 *                 description: The ID of the admin who created the assignment.
 *                 example: 1
 *               feedback:
 *                 type: string
 *                 description: Feedback for the assignment submission.
 *                 example: "The work needs more effort and focus."
 *     responses:
 *       200:
 *         description: Assignment submission rejected successfully.
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
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     assignmentId:
 *                       type: integer
 *                       example: 1
 *                     userId:
 *                       type: integer
 *                       example: 123
 *                     status:
 *                       type: string
 *                       example: "REJECTED"
 *                     feedback:
 *                       type: string
 *                       example: "The work needs more effort and focus."
 *                 message:
 *                   type: string
 *                   example: "Assignment submission rejected successfully."
 *       400:
 *         description: Bad Request - Invalid or missing request data.
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
 *                   example: "Invalid request data."
 *       403:
 *         description: Forbidden - Unauthorized access or assignment not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 403
 *                 error:
 *                   type: string
 *                   example: "Unauthorized or assignment not found."
 *       404:
 *         description: Not Found - Submission not found.
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
 *                   example: "Submission not found."
 *       401:
 *         description: Unauthorized - Invalid or missing token.
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
 *                   example: "Not authenticated, token missing"
 */
adminRouter.post(
  "/assignments/:id/reject",
  protectAdminRoute,
  rejectAssignment // Reject an assignment
);

// Submission management routes
/**
 * @swagger
 * /api/v1/admin/submissions:
 *   get:
 *     summary: Get all submissions for the admin
 *     security:
 *       - cookieAuth: []
 *     components:
 *       securitySchemes:
 *         cookieAuth:
 *           type: apiKey
 *           in: cookie
 *           name: admin-token
 *     tags: [Admin]
 *     description: This endpoint fetches all submissions for a specific admin, including assignment details and user information.
 *     responses:
 *       200:
 *         description: Successfully fetched all submissions.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       status:
 *                         type: string
 *                         example: "ACCEPTED"
 *                       submittedAt:
 *                         type: string
 *                         example: "2024-11-17T12:34:56Z"
 *                       feedback:
 *                         type: string
 *                         example: "Great work, keep it up!"
 *                       submitText:
 *                         type: string
 *                         example: "The assignment was well done."
 *                       assignment:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           task:
 *                             type: string
 *                             example: "Task 1"
 *                           description:
 *                             type: string
 *                             example: "Solve the problem related to algorithms."
 *                           dueDate:
 *                             type: string
 *                             example: "2024-11-20"
 *                       user:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 123
 *                           name:
 *                             type: string
 *                             example: "John Doe"
 *                           email:
 *                             type: string
 *                             example: "john.doe@example.com"
 *                 message:
 *                   type: string
 *                   example: "Submissions fetched successfully"
 *       400:
 *         description: Bad Request - Missing or invalid admin ID.
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
 *                   example: "Admin ID is required."
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token.
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
 *                   example: "Not authenticated, token missing"
 *       403:
 *         description: Forbidden - The admin is not authorized to view submissions.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 403
 *                 error:
 *                   type: string
 *                   example: "Unauthorized access."
 *       404:
 *         description: Not Found - No submissions found for the admin.
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
 *                   example: "No submissions found."
 */
adminRouter.get("/submissons", protectAdminRoute, getAllSubmissions); // Get all submissions

/**
 * @swagger
 * /api/v1/admin/submissions/{id}:
 *   get:
 *     summary: Get a specific submission by ID
 *     security:
 *       - cookieAuth: []
 *     components:
 *       securitySchemes:
 *         cookieAuth:
 *           type: apiKey
 *           in: cookie
 *           name: admin-token
 *     tags: [Admin]
 *     description: Fetches details of a specific submission by its ID for an admin. This includes the submission's status, feedback, assignment details, and user information.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the submission to fetch.
 *         schema:
 *           type: string
 *           example: "1"
 *     responses:
 *       200:
 *         description: Successfully fetched the submission details.
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
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     status:
 *                       type: string
 *                       example: "ACCEPTED"
 *                     submittedAt:
 *                       type: string
 *                       example: "2024-11-17T12:34:56Z"
 *                     feedback:
 *                       type: string
 *                       example: "Great work!"
 *                     submitText:
 *                       type: string
 *                       example: "Detailed solution provided."
 *                     assignment:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         task:
 *                           type: string
 *                           example: "Task 1"
 *                         description:
 *                           type: string
 *                           example: "Solve the problem related to algorithms."
 *                         dueDate:
 *                           type: string
 *                           example: "2024-11-20"
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 123
 *                         name:
 *                           type: string
 *                           example: "John Doe"
 *                         email:
 *                           type: string
 *                           example: "john.doe@example.com"
 *                 message:
 *                   type: string
 *                   example: "Submission fetched successfully"
 *       400:
 *         description: Bad Request - Missing or invalid parameters.
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
 *                   example: "Submission ID is required."
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token.
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
 *                   example: "Not authenticated, token missing."
 *       403:
 *         description: Forbidden - Admin is not authorized to access this submission.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 403
 *                 error:
 *                   type: string
 *                   example: "Unauthorized access."
 *       404:
 *         description: Not Found - Submission not found.
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
 *                   example: "Submission not found."
 */
adminRouter.get("/submissons/:id", protectAdminRoute, getSubmissonById); // Get a specific submission by ID

/**
 * @swagger
 * /api/v1/admin/submissions/{assignmentId}/{status}:
 *   get:
 *     summary: Get submissions by assignment ID and status
 *     security:
 *       - cookieAuth: []
 *     components:
 *       securitySchemes:
 *         cookieAuth:
 *           type: apiKey
 *           in: cookie
 *           name: admin-token
 *     tags: [Admin]
 *     description: Fetches submissions for a specific assignment based on the assignment ID and submission status (e.g., PENDING, SUBMITTED, ACCEPTED, REJECTED). Includes user and assignment details.
 *     parameters:
 *       - in: path
 *         name: assignmentId
 *         required: true
 *         description: The ID of the assignment to fetch submissions for.
 *         schema:
 *           type: string
 *           example: "1"
 *       - in: path
 *         name: status
 *         required: true
 *         description: The status of the submissions to filter (e.g., PENDING, SUBMITTED, ACCEPTED, REJECTED).
 *         schema:
 *           type: string
 *           example: "PENDING"
 *     responses:
 *       200:
 *         description: Successfully fetched submissions for the given assignment ID and status.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       status:
 *                         type: string
 *                         example: "PENDING"
 *                       submittedAt:
 *                         type: string
 *                         example: "2024-11-17T12:34:56Z"
 *                       feedback:
 *                         type: string
 *                         example: null
 *                       submitText:
 *                         type: string
 *                         example: "The work is under review."
 *                       assignment:
 *                         type: object
 *                         properties:
 *                           task:
 *                             type: string
 *                             example: "Task 1"
 *                           description:
 *                             type: string
 *                             example: "Solve algorithmic problems."
 *                       user:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: "John Doe"
 *                           email:
 *                             type: string
 *                             example: "john.doe@example.com"
 *                 message:
 *                   type: string
 *                   example: "Submissions found."
 *       400:
 *         description: Bad Request - Missing or invalid parameters.
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
 *                   example: "Invalid or missing status."
 *       401:
 *         description: Unauthorized - Missing or invalid authentication token.
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
 *                   example: "Not authenticated, token missing."
 *       403:
 *         description: Forbidden - Admin is not authorized to view submissions.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 403
 *                 error:
 *                   type: string
 *                   example: "Unauthorized access."
 *       404:
 *         description: Not Found - No submissions found for the given assignment ID and status.
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
 *                   example: "No submissions found for the given status."
 */
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
 *     security:
 *      - cookieAuth: []
 *     components:
 *      securitySchemes:
 *       cookieAuth:
 *       type: apiKey
 *       in: cookie
 *       name: admin-token
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
