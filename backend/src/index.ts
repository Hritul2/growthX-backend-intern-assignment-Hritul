// imports
import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { errorHandler } from "@/middlewares/error.middleware";
import { userRouter } from "@/routes/user.route";
import { adminRouter } from "@/routes/admin.route";

//config
dotenv.config();

// constants
const PORT = Number(process.env.PORT) || 3000;

// declarations
const app = express();

// pre processing middlewares
app.use(cors());
app.use(express.json());

const apiRouter = express.Router();

apiRouter.use("/user", userRouter);
apiRouter.use("/admin", adminRouter);

app.use("/api/v1", apiRouter);
// post processing middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
