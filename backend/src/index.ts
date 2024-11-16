// imports
import express from "express";
import * as dotenv from "dotenv";

//config
dotenv.config();

// constants
const PORT = Number(process.env.PORT) || 3000;

// declarations
const app = express();

// middlewares
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
