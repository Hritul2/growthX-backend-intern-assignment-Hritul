// imports
import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import cokkieParser from "cookie-parser";
import { errorHandler } from "@/middlewares/error.middleware";
import { userRouter } from "@/routes/user.route";
import { adminRouter } from "@/routes/admin.route";
import { asyncHandler } from "@/utils/asyncHandler";

//config
dotenv.config();

// constants
const PORT = Number(process.env.PORT) || 3000;

// declarations
const app = express();

// pre processing middlewares
app.use(cors());
app.use(express.json());
app.use(cokkieParser());

const apiRouter = express.Router();

app.use("/api/v1", apiRouter);
apiRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    res.send("Health check route Successful!!!");
  })
);
apiRouter.use("/user", userRouter);
apiRouter.use("/admin", adminRouter);

// post processing middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
