// imports
import express from "express";
import * as dotenv from "dotenv";
import { errorHandler } from "@/middlewares/error.middleware";

//config
dotenv.config();

// constants
const PORT = Number(process.env.PORT) || 3000;

// declarations
const app = express();

// pre processing middlewares
app.use(express.json());

// post processing middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
