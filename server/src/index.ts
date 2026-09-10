import dotenv from "dotenv";
// Load environment variables first
dotenv.config();

import express, { Request, Response} from "express";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.config";
import userRouter from "./routes/user.route";
import taskRouter from "./routes/task.route";

const app = express();

// Global Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Connect to MongoDB
connectDB();

// API Routes
app.use("/api/user", userRouter);
app.use("/api/tasks", taskRouter);

// Health check and root route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    name: "TaskFlow API",
    version: "1.0.0",
    status: "online",
    timestamp: new Date().toISOString(),
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`TaskFlow Server is running on port ${PORT}`);
});

export default app;