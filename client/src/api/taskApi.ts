import { api } from './apiClient';
import {
  CreateTaskPayload,
  Task,
  TaskFilterOptions,
  TaskStats,
  UpdateTaskPayload,
} from '../types/task.types';

export const taskApi = {
  getTasks: async (params: TaskFilterOptions = {}) =>
    (await api.get<{ count: number; tasks: Task[] }>('/tasks', { params })).data,
  getStats: async () =>
    (await api.get<{ success: boolean; stats: TaskStats }>('/tasks/stats')).data,
  createTask: async (payload: CreateTaskPayload) =>
    (await api.post<{ success: boolean; task: Task }>('/tasks', payload)).data,
  updateTask: async (id: string, payload: UpdateTaskPayload) =>
    (await api.put<{ success: boolean; task: Task }>(`/tasks/${id}`, payload)).data,
  toggleTaskStatus: async (id: string) =>
    (await api.patch<{ success: boolean; task: Task }>(`/tasks/${id}/toggle`)).data,
  deleteTask: async (id: string) =>
    (await api.delete<{ success: boolean; message: string }>(`/tasks/${id}`)).data,
};
