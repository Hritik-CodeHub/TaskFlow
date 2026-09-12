import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  TextInput,
} from 'react-native';
import {
  AlertTriangle,
  ArrowUpDown,
  CheckCheck,
  CircleDashed,
  ClipboardList,
  Plus,
  Search,
  X,
} from 'lucide-react-native';
import { taskApi } from '../api/taskApi';
import { useTheme } from '../context/ThemeContext';
import {
  CreateTaskPayload,
  Task,
  TaskFilterOptions,
  TaskStats,
  UpdateTaskPayload,
} from '../types/task.types';
import { TaskCard } from '../components/tasks/TaskCard';
import { TaskFilterBar } from '../components/tasks/TaskFilterBar';
import { SortSelector } from '../components/tasks/SortSelector';
import { AddEditTaskModal } from '../components/tasks/AddEditTaskModal';
import { TaskDetailModal } from '../components/tasks/TaskDetailModal';
import { Header } from '../components/common/Header';
import { borderRadius, typography } from '../theme/typography';

const defaultFilters: TaskFilterOptions = {
  status: 'ALL',
  priority: 'ALL',
  category: 'ALL',
  search: '',
  sortBy: 'smart',
  order: 'asc',
};

export const TasksScreen: React.FC = () => {
  const { colors } = useTheme();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [filters, setFilters] = useState<TaskFilterOptions>(defaultFilters);

  const fetchTasks = async (isRefresh: boolean = false) => {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      try {
        const response = await taskApi.getTasks(filters);
        setTasks(response.tasks || []);
      } catch (err: any) {
        console.warn('Failed to load tasks:', err.message);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    };

  const fetchStats = async () => {
    try {
      const response = await taskApi.getStats();
      if (response.success && response.stats) {
        setStats(response.stats);
      }
    } catch (err: any) {
      console.warn('Could not fetch task stats:', err.message);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchStats();
  }, [filters]);

  const setFilter = (key: keyof TaskFilterOptions, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters =() => {
    setFilters({ ...defaultFilters });
  };

  const createTask = async (payload: CreateTaskPayload): Promise<boolean> => {
      try {
        const response = await taskApi.createTask(payload);
        if (response.success && response.task) {
          await fetchTasks();
          await fetchStats();
          return true;
        }
        return false;
      } catch (err: any) {
        console.warn('Failed to create task:', err.message);
        return false;
      }
    };

  const updateTask = async (id: string, payload: UpdateTaskPayload): Promise<boolean> => {
      try {
        const response = await taskApi.updateTask(id, payload);
        if (response.success && response.task) {
          setTasks((prev) =>
            prev.map((t) => (t._id === id ? response.task : t))
          );
          await fetchStats();
          return true;
        }
        return false;
      } catch (err: any) {
        console.warn('Failed to update task:', err.message);
        return false;
      }
    };

  const toggleTask = async (id: string): Promise<boolean> => {
      setTasks((prev) =>
        prev.map((t) =>
          t._id === id
            ? {
                ...t,
                status: t.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED',
              }
            : t
        )
      );

      try {
        const response = await taskApi.toggleTaskStatus(id);
        if (response.success && response.task) {
          setTasks((prev) =>
            prev.map((t) => (t._id === id ? response.task : t))
          );
          await fetchStats();
          return true;
        }

        await fetchTasks();
        return false;
      } catch (err: any) {
        console.warn('Failed to update task status:', err.message);
        await fetchTasks();
        return false;
      }
    };

  const deleteTask = async (id: string): Promise<boolean> => {
      const previousTasks = tasks;
      setTasks((prev) => prev.filter((t) => t._id !== id));

      try {
        const response = await taskApi.deleteTask(id);
        if (response.success) {
          await fetchStats();
          return true;
        }
        setTasks(previousTasks);
        return false;
      } catch (err: any) {
        console.warn('Failed to delete task:', err.message);
        setTasks(previousTasks);
        return false;
      }
    };

  const [modalVisible, setModalVisible] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [taskDetails, setTaskDetails] = useState<Task | null>(null);
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  const filteredTasks = useMemo(() => tasks, [tasks]);

  const handleOpenCreateModal = () => {
    setTaskToEdit(null);
    setTaskDetails(null);
    setModalVisible(true);
  };

  const handleOpenEditModal = (task: Task) => {
    setTaskToEdit(task);
    setTaskDetails(null);
    setModalVisible(true);
  };

  const handleOpenDetails = (task: Task) => {
    setTaskDetails(task);
    setDetailModalVisible(true);
  };

  const handleCloseDetails = () => {
    setTaskDetails(null);
    setDetailModalVisible(false);
  };

  const summaryCards = useMemo(
    () => [
      {
        label: 'Total',
        value: stats?.totalTasks ?? 0,
        accent: colors.primary,
        icon: ClipboardList,
      },
      {
        label: 'Done',
        value: stats?.completedTasks ?? 0,
        accent: colors.success,
        icon: CheckCheck,
      },
      {
        label: 'Open',
        value: stats?.pendingTasks ?? 0,
        accent: colors.warning,
        icon: CircleDashed,
      },
      {
        label: 'Overdue',
        value: stats?.overdueTasks ?? 0,
        accent: colors.error,
        icon: AlertTriangle,
      },
    ],
    [colors, stats]
  );

  const getSortLabel = () => {
    switch (filters.sortBy) {
      case 'smart':
        return 'Smart Urgency';
      case 'deadline':
        return 'Deadline';
      case 'priority':
        return 'Priority';
      case 'scheduledAt':
        return 'Scheduled';
      case 'createdAt':
        return 'Newest';
      default:
        return 'Sort';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        subtitle={
          stats
            ? `${stats.completionRate}% completion rate`
            : 'Stay on top of what matters'
        }
      />

      <View style={styles.summaryRow}>
        {summaryCards.map((card) => (
          <View
            key={card.label}
            style={[
              styles.summaryCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                shadowColor: colors.cardShadow,
              },
            ]}
          >
            <View style={styles.summaryTopRow}>
              <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>
                {card.label}
              </Text>
              <card.icon size={14} color={card.accent} />
            </View>
            <Text
              style={[
                styles.summaryValue,
                { color: card.accent },
              ]}
            >
              {card.value}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.searchRow}>
        <View
          style={[
            styles.searchContainer,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <Search size={16} color={colors.textMuted} />
          <TextInput
            placeholder="Search tasks..."
            placeholderTextColor={colors.textMuted}
            value={filters.search || ''}
            onChangeText={(text) => setFilter('search', text)}
            style={[
              styles.searchInput,
              typography.body,
              { color: colors.textPrimary },
            ]}
          />
          {filters.search ? (
            <TouchableOpacity
              onPress={() => setFilter('search', '')}
              activeOpacity={0.7}
            >
              <X size={14} color={colors.textMuted} />
            </TouchableOpacity>
          ) : null}
        </View>

        <TouchableOpacity
          onPress={() =>
            setFilter('order', filters.order === 'asc' ? 'desc' : 'asc')
          }
          style={[
            styles.sortOrderButton,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
          activeOpacity={0.7}
        >
          <ArrowUpDown size={16} color={colors.textSecondary} />
          <Text
            style={[
              styles.sortButtonText,
              typography.caption,
              { color: colors.textSecondary, fontWeight: '600' },
            ]}
          >
            {filters.order === 'asc' ? 'Asc' : 'Desc'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setSortModalVisible(true)}
          style={[
            styles.sortButton,
            {
              backgroundColor: colors.surface,
              borderColor:
                filters.sortBy === 'smart' ? colors.primary : colors.border,
            },
          ]}
          activeOpacity={0.7}
        >
          <ArrowUpDown
            size={16}
            color={
              filters.sortBy === 'smart' ? colors.primary : colors.textSecondary
            }
          />
          <Text
            style={[
              styles.sortButtonText,
              typography.caption,
              {
                color:
                  filters.sortBy === 'smart'
                    ? colors.primary
                    : colors.textSecondary,
                fontWeight: filters.sortBy === 'smart' ? '700' : '500',
              },
            ]}
          >
            {getSortLabel()}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Filter Bar (Status tabs + Category tags) */}
      <TaskFilterBar
        filters={filters}
        onFilterChange={setFilter}
        onResetFilters={resetFilters}
      />

      {/* Task List */}
      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            onToggle={toggleTask}
            onEdit={handleOpenEditModal}
            onDelete={deleteTask}
            onOpenDetails={handleOpenDetails}
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => fetchTasks(true)}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        ListEmptyComponent={
          isLoading
            ? undefined
            : (
                <View style={styles.emptyContainer}>
                  <View
                    style={[
                      styles.emptyCircle,
                      {
                        backgroundColor: colors.surface,
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    <Text style={styles.emptyEmoji}>📋</Text>
                  </View>
                  <Text
                    style={[
                      styles.emptyTitle,
                      typography.h3,
                      { color: colors.textPrimary },
                    ]}
                  >
                    No tasks found
                  </Text>
                  <Text
                    style={[
                      styles.emptySubtitle,
                      typography.body,
                      { color: colors.textMuted },
                    ]}
                  >
                    {filters.search ||
                    filters.status !== 'ALL' ||
                    filters.category !== 'ALL'
                      ? 'Try changing your search keywords or filter selection'
                      : 'Start your productive day by creating your first task!'}
                  </Text>
                  <TouchableOpacity
                    onPress={handleOpenCreateModal}
                    style={[
                      styles.emptyCreateButton,
                      { backgroundColor: colors.primary },
                    ]}
                    activeOpacity={0.8}
                  >
                    <Plus size={16} color="#FFFFFF" />
                    <Text style={styles.emptyCreateText}>Add New Task</Text>
                  </TouchableOpacity>
                </View>
              )
        }
      />

      {/* Floating Action Button (FAB) */}
      <TouchableOpacity
        onPress={handleOpenCreateModal}
        style={[styles.fab, { backgroundColor: colors.primary }]}
        activeOpacity={0.85}
      >
        <Plus size={24} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Modals */}
      <AddEditTaskModal
        visible={modalVisible}
        taskToEdit={taskToEdit}
        onClose={() => setModalVisible(false)}
        onSubmitCreate={createTask}
        onSubmitUpdate={updateTask}
      />

      <TaskDetailModal
        visible={detailModalVisible}
        task={taskDetails}
        onClose={handleCloseDetails}
        onEdit={handleOpenEditModal}
        onToggle={toggleTask}
        onDelete={deleteTask}
      />

      <SortSelector
        visible={sortModalVisible}
        currentSort={filters.sortBy || 'smart'}
        onSelectSort={(sort) => setFilter('sortBy', sort)}
        onClose={() => setSortModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  summaryCard: {
    flex: 1,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  summaryTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  summaryValue: {
    fontSize: 22,
    fontWeight: '800',
    marginTop: 4,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
    gap: 8,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingHorizontal: 12,
    height: 42,
  },
  searchInput: {
    flex: 1,
    marginHorizontal: 8,
    fontSize: 14,
    paddingVertical: 0,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 42,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    gap: 6,
  },
  sortOrderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    height: 42,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    gap: 4,
  },
  sortButtonText: {
    fontSize: 12,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 88,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyEmoji: {
    fontSize: 32,
  },
  emptyTitle: {
    marginBottom: 6,
    textAlign: 'center',
  },
  emptySubtitle: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 13,
  },
  emptyCreateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: borderRadius.md,
    gap: 6,
  },
  emptyCreateText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
  },
});
