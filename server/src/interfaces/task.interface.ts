import mongoose, { Document } from "mongoose";

export enum TaskPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  URGENT = "URGENT",
}

export enum TaskStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
}

export enum TaskCategory {
  WORK = "WORK",
  PERSONAL = "PERSONAL",
  STUDY = "STUDY",
  HEALTH = "HEALTH",
  FINANCE = "FINANCE",
  OTHER = "OTHER",
}

export interface ITask extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  scheduledAt: Date;
  deadline: Date;
  priority: TaskPriority;
  status: TaskStatus;
  category: TaskCategory;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}