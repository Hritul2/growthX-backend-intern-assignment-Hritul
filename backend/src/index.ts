import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "@/middlewares/error.middleware";
import { userRouter } from "@/routes/user.route";
import { adminRouter } from "@/routes/admin.route";
import { asyncHandler } from "@/utils/asyncHandler";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
import path from "path";
import { ApiResponse } from "./utils/ApiResponse";

// config
dotenv.config();

// constants
const PORT = Number(process.env.PORT) || 3000;

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "GrowthX Backend Intern Assignment: Hritul",
      version: "1.0.0",
      description:
        "API documentation using Swagger for the growthX backend intern assignment",
      contact: {
        name: "Hritul",
      },
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: "Development server",
      },
    ],
    tags: [
      {
        name: "Health Check",
        description: "API health check endpoints",
      },
      {
        name: "User",
        description: "User related operations",
      },
      {
        name: "Admin",
        description: "Admin related operations",
      },
    ],
  },
  apis: [
    path.join(__dirname, "./routes/*.ts"),
    path.join(__dirname, "./routes/**/*.ts"),
    // Include the current file for the health check route
    __filename,
  ],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

// Express app initialization
const app = express();

// Pre-processing middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

const apiRouter = express.Router();
app.use("/api/v1", apiRouter);

/**
 * @swagger
 * /api/v1:
 *   get:
 *     tags:
 *       - Health Check
 *     summary: API Health Check
 *     description: Returns a success message if the API is running properly
 *     responses:
 *       200:
 *         description: Health check successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties: {}
 *                 message:
 *                   type: string
 *                   example: "Health check route Successful!!!"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */
apiRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    res
      .status(200)
      .json(new ApiResponse(200, {}, "Health check route Successful!!!"));
  })
);

apiRouter.use("/user", userRouter);
apiRouter.use("/admin", adminRouter);

// Post-processing middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(
    `API documentation available at http://localhost:${PORT}/api-docs`
  );
});

export default app;
