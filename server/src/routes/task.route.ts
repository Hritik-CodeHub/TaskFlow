import { Router } from "express";
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  toggleTaskStatus,
  deleteTask,
  getTaskStats,
} from "../controllers/task.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const taskRouter = Router();

// Protect all task endpoints with authentication middleware
taskRouter.use(authMiddleware as any);

// Task CRUD & specialized routes
taskRouter.get("/stats", getTaskStats as any);
taskRouter.get("/", getTasks as any);
taskRouter.post("/", createTask as any);
taskRouter.get("/:id", getTaskById as any);
taskRouter.put("/:id", updateTask as any);
taskRouter.patch("/:id/toggle", toggleTaskStatus as any);
taskRouter.delete("/:id", deleteTask as any);

export default taskRouter;
