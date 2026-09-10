export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type TaskStatus = 'PENDING' | 'COMPLETED';

export type TaskCategory =
  | 'WORK'
  | 'PERSONAL'
  | 'STUDY'
  | 'HEALTH'
  | 'FINANCE'
  | 'OTHER';

export interface Task {
  _id: string;
  userId: string;
  title: string;
  description?: string;
  scheduledAt: string;
  deadline: string;
  priority: TaskPriority;
  status: TaskStatus;
  category: TaskCategory;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  scheduledAt: string;
  deadline: string;
  priority: TaskPriority;
  category: TaskCategory;
  tags?: string[];
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  scheduledAt?: string;
  deadline?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  category?: TaskCategory;
  tags?: string[];
}

export type SortOption = 'smart' | 'deadline' | 'priority' | 'scheduledAt' | 'createdAt';

export interface TaskFilterOptions {
  status?: TaskStatus | 'ALL';
  priority?: TaskPriority | 'ALL';
  category?: TaskCategory | 'ALL';
  search?: string;
  sortBy?: SortOption;
  order?: 'asc' | 'desc';
}

export interface TaskStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  completionRate: number;
  priorityBreakdown: Record<TaskPriority, number>;
  categoryBreakdown: Record<TaskCategory, number>;
}
