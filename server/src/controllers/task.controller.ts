import { Response } from "express";
import Task from "../models/task.model";
import { AuthRequest } from "../middleware/auth.middleware";
import { TaskPriority, TaskStatus, TaskCategory } from "../interfaces/task.interface";
import { smartSortTasks } from "../utils/sorting.util";

/**
 * Create a new task
 */
export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const {
      title,
      description,
      scheduledAt,
      deadline,
      priority,
      category,
      tags,
    } = req.body;

    // Validation
    if (!title || typeof title !== "string" || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title is required and must not be empty.",
      });
    }

    if (!scheduledAt || isNaN(new Date(scheduledAt).getTime())) {
      return res.status(400).json({
        success: false,
        message: "A valid scheduled date and time is required.",
      });
    }

    if (!deadline || isNaN(new Date(deadline).getTime())) {
      return res.status(400).json({
        success: false,
        message: "A valid deadline date and time is required.",
      });
    }

    const scheduledDate = new Date(scheduledAt);
    const deadlineDate = new Date(deadline);

    if (deadlineDate < scheduledDate) {
      return res.status(400).json({
        success: false,
        message: "Deadline cannot be earlier than the scheduled date/time.",
      });
    }

    // Validate priority if provided
    let taskPriority = TaskPriority.MEDIUM;
    if (priority && Object.values(TaskPriority).includes(priority)) {
      taskPriority = priority;
    }

    // Validate category if provided
    let taskCategory = TaskCategory.OTHER;
    if (category && Object.values(TaskCategory).includes(category)) {
      taskCategory = category;
    }

    const task = await Task.create({
      userId,
      title: title.trim(),
      description: description ? description.trim() : "",
      scheduledAt: scheduledDate,
      deadline: deadlineDate,
      priority: taskPriority,
      status: TaskStatus.PENDING,
      category: taskCategory,
      tags: Array.isArray(tags) ? tags : [],
    });

    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      task,
    });
  } catch (error: any) {
    console.error("Error creating task:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create task",
      error: error.message,
    });
  }
};

/**
 * Get all tasks for the logged in user with filtering, searching, and sorting
 */
export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const {
      status,
      priority,
      category,
      search,
      sortBy = "smart",
      order = "asc",
    } = req.query;

    const query: any = { userId };

    // Status filter
    if (status && status !== "ALL") {
      query.status = status;
    }

    // Priority filter
    if (priority && priority !== "ALL") {
      query.priority = priority;
    }

    // Category filter
    if (category && category !== "ALL") {
      query.category = category;
    }

    // Keyword search filter (matches title or description)
    if (search && typeof search === "string" && search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");
      query.$or = [{ title: searchRegex }, { description: searchRegex }];
    }

    let tasks;

    if (sortBy === "smart") {
      // Fetch all matching tasks and sort using smart urgency algorithm
      const rawTasks = await Task.find(query).lean();
      tasks = smartSortTasks(rawTasks as any);
    } else {
      // Database level sorting
      const sortOptions: any = {};
      const sortDirection = order === "desc" ? -1 : 1;

      if (sortBy === "deadline") {
        sortOptions.deadline = sortDirection;
      } else if (sortBy === "priority") {
        // Priority order mapping
        sortOptions.priority = sortDirection;
      } else if (sortBy === "scheduledAt") {
        sortOptions.scheduledAt = sortDirection;
      } else {
        sortOptions.createdAt = sortDirection;
      }

      tasks = await Task.find(query).sort(sortOptions).lean();
    }

    return res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error: any) {
    console.error("Error fetching tasks:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch tasks",
      error: error.message,
    });
  }
};

/**
 * Get a single task by ID
 */
export const getTaskById = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    const task = await Task.findOne({ _id: id, userId });
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    return res.status(200).json({
      success: true,
      task,
    });
  } catch (error: any) {
    console.error("Error fetching task:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch task",
      error: error.message,
    });
  }
};

/**
 * Update an existing task
 */
export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    const task = await Task.findOne({ _id: id, userId });
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    const {
      title,
      description,
      scheduledAt,
      deadline,
      priority,
      status,
      category,
      tags,
    } = req.body;

    if (title !== undefined) {
      if (typeof title !== "string" || !title.trim()) {
        return res.status(400).json({
          success: false,
          message: "Title must be a non-empty string",
        });
      }
      task.title = title.trim();
    }

    if (description !== undefined) {
      task.description = description ? description.trim() : "";
    }

    if (scheduledAt !== undefined) {
      const scheduledDate = new Date(scheduledAt);
      if (isNaN(scheduledDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid scheduled date",
        });
      }
      task.scheduledAt = scheduledDate;
    }

    if (deadline !== undefined) {
      const deadlineDate = new Date(deadline);
      if (isNaN(deadlineDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid deadline date",
        });
      }
      task.deadline = deadlineDate;
    }

    if (task.deadline < task.scheduledAt) {
      return res.status(400).json({
        success: false,
        message: "Deadline cannot be earlier than scheduled date",
      });
    }

    if (priority && Object.values(TaskPriority).includes(priority)) {
      task.priority = priority;
    }

    if (status && Object.values(TaskStatus).includes(status)) {
      task.status = status;
    }

    if (category && Object.values(TaskCategory).includes(category)) {
      task.category = category;
    }

    if (tags && Array.isArray(tags)) {
      task.tags = tags;
    }

    await task.save();

    return res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task,
    });
  } catch (error: any) {
    console.error("Error updating task:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update task",
      error: error.message,
    });
  }
};

/**
 * Toggle task completion status
 */
export const toggleTaskStatus = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    const task = await Task.findOne({ _id: id, userId });
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    task.status =
      task.status === TaskStatus.COMPLETED
        ? TaskStatus.PENDING
        : TaskStatus.COMPLETED;

    await task.save();

    return res.status(200).json({
      success: true,
      message: `Task marked as ${task.status.toLowerCase()}`,
      task,
    });
  } catch (error: any) {
    console.error("Error toggling task status:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to toggle task status",
      error: error.message,
    });
  }
};

/**
 * Delete a task
 */
export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    const result = await Task.findOneAndDelete({ _id: id, userId });
    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting task:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete task",
      error: error.message,
    });
  }
};

/**
 * Get task analytics and statistics for user dashboard
 */
export const getTaskStats = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const tasks = await Task.find({ userId }).lean();
    const now = new Date();

    const totalTasks = tasks.length;
    let completedTasks = 0;
    let pendingTasks = 0;
    let overdueTasks = 0;

    const priorityBreakdown: Record<string, number> = {
      [TaskPriority.URGENT]: 0,
      [TaskPriority.HIGH]: 0,
      [TaskPriority.MEDIUM]: 0,
      [TaskPriority.LOW]: 0,
    };

    const categoryBreakdown: Record<string, number> = {
      [TaskCategory.WORK]: 0,
      [TaskCategory.PERSONAL]: 0,
      [TaskCategory.STUDY]: 0,
      [TaskCategory.HEALTH]: 0,
      [TaskCategory.FINANCE]: 0,
      [TaskCategory.OTHER]: 0,
    };

    tasks.forEach((task) => {
      if (task.status === TaskStatus.COMPLETED) {
        completedTasks += 1;
      } else {
        pendingTasks += 1;
        if (new Date(task.deadline) < now) {
          overdueTasks += 1;
        }
      }

      if (task.priority && priorityBreakdown[task.priority] !== undefined) {
        priorityBreakdown[task.priority] += 1;
      }

      if (task.category && categoryBreakdown[task.category] !== undefined) {
        categoryBreakdown[task.category] += 1;
      }
    });

    const completionRate =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return res.status(200).json({
      success: true,
      stats: {
        totalTasks,
        completedTasks,
        pendingTasks,
        overdueTasks,
        completionRate,
        priorityBreakdown,
        categoryBreakdown,
      },
    });
  } catch (error: any) {
    console.error("Error fetching task stats:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch task stats",
      error: error.message,
    });
  }
};
