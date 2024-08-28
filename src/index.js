import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/database.js";
import songRouter from "./routes/songRoute.js";

dotenv.config();

//database connection
connectDB();

const app = express();

//for middleware
app.use(cors());
app.use(express.json());

//routes
app.use("/api", songRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
