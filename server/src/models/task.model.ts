import mongoose, { Schema } from "mongoose";
import { ITask, TaskCategory, TaskPriority, TaskStatus } from "../interfaces/task.interface";

const taskSchema = new Schema<ITask>(
  {
    // User who owns this task
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Task title
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      minlength: [1, "Task title cannot be empty"],
      maxlength: [150, "Task title cannot exceed 150 characters"],
    },

    // Optional task description
    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
      default: "",
    },

    // When the task is scheduled
    scheduledAt: {
      type: Date,
      required: [true, "Scheduled date and time is required"],
    },

    // Task deadline
    deadline: {
      type: Date,
      required: [true, "Deadline is required"],
    },

    // Task priority
    priority: {
      type: String,
      enum: Object.values(TaskPriority),
      default: TaskPriority.MEDIUM,
      required: true,
    },

    // Task completion status
    status: {
      type: String,
      enum: Object.values(TaskStatus),
      default: TaskStatus.PENDING,
      required: true,
    },

    // Task category
    category: {
      type: String,
      enum: Object.values(TaskCategory),
      default: TaskCategory.OTHER,
      required: true,
    },

    // Optional tags
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Helpful indexes for queries and search
taskSchema.index({ userId: 1, status: 1 });
taskSchema.index({ userId: 1, deadline: 1 });
taskSchema.index({ userId: 1, priority: 1 });
taskSchema.index({ title: "text", description: "text" });

const Task = mongoose.model<ITask>("Task", taskSchema);

export default Task;