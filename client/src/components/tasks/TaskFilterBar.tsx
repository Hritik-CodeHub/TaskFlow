import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  BookOpen,
  BriefcaseBusiness,
  HeartPulse,
  ListFilter,
  Minus,
  MoreHorizontal,
  PiggyBank,
  UserRound,
} from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import {
  TaskCategory,
  TaskPriority,
  TaskFilterOptions,
} from '../../types/task.types';
import { getCategoryColor, getPriorityColor } from '../../theme/colors';
import { typography } from '../../theme/typography';

interface TaskFilterBarProps {
  filters: TaskFilterOptions;
  onFilterChange: (key: keyof TaskFilterOptions, value: any) => void;
  onResetFilters: () => void;
}

const CATEGORIES: (TaskCategory | 'ALL')[] = [
  'ALL',
  'WORK',
  'PERSONAL',
  'STUDY',
  'HEALTH',
  'FINANCE',
  'OTHER',
];

const CATEGORY_ICONS = {
  ALL: ListFilter,
  WORK: BriefcaseBusiness,
  PERSONAL: UserRound,
  STUDY: BookOpen,
  HEALTH: HeartPulse,
  FINANCE: PiggyBank,
  OTHER: MoreHorizontal,
} as const;

const PRIORITIES: (TaskPriority | 'ALL')[] = [
  'ALL',
  'URGENT',
  'HIGH',
  'MEDIUM',
  'LOW',
];

const PRIORITY_ICONS = {
  ALL: ListFilter,
  URGENT: AlertTriangle,
  HIGH: ArrowUpRight,
  MEDIUM: Minus,
  LOW: ArrowDownRight,
} as const;

export const TaskFilterBar: React.FC<TaskFilterBarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
}) => {
  const { colors } = useTheme();

  const isFiltered =
    filters.status !== 'ALL' ||
    filters.priority !== 'ALL' ||
    filters.category !== 'ALL';

  const getCategoryLabel = (category: TaskCategory | 'ALL') => {
    if (category === 'ALL') {
      return 'All Categories';
    }

    return category.charAt(0) + category.slice(1).toLowerCase();
  };

  return (
    <View style={styles.container}>
      {/* Status Segment Controls (All / Pending / Done) */}
      <View
        style={[
          styles.statusSegment,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        {(['ALL', 'PENDING', 'COMPLETED'] as const).map((status) => {
          const isActive = filters.status === status;
          let label = 'Done';

          if (status === 'ALL') {
            label = 'All';
          } else if (status === 'PENDING') {
            label = 'Pending';
          }

          return (
            <TouchableOpacity
              key={status}
              onPress={() => onFilterChange('status', status)}
              style={[
                styles.statusTab,
                isActive && {
                  backgroundColor: colors.primary,
                },
              ]}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.statusText,
                  typography.caption,
                  {
                    color: isActive ? '#FFFFFF' : colors.textSecondary,
                    fontWeight: isActive ? '700' : '500',
                  },
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Horizontal Category Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsScroll}
      >
        {CATEGORIES.map((category) => {
          const isActive = filters.category === category;
          const chipColor =
            category === 'ALL'
              ? colors.primary
              : getCategoryColor(category, colors);
          const CategoryIcon = CATEGORY_ICONS[category];

          return (
            <TouchableOpacity
              key={category}
              onPress={() => onFilterChange('category', category)}
              style={[
                styles.chip,
                {
                  backgroundColor: isActive ? chipColor : colors.surface,
                  borderColor: isActive ? chipColor : colors.border,
                },
              ]}
              activeOpacity={0.7}
            >
              <View style={styles.chipContent}>
                <CategoryIcon
                  size={14}
                  color={isActive ? '#FFFFFF' : colors.textSecondary}
                />
                <Text
                  style={[
                    styles.chipText,
                    typography.caption,
                    {
                      color: isActive ? '#FFFFFF' : colors.textSecondary,
                      fontWeight: isActive ? '700' : '500',
                    },
                  ]}
                >
                  {getCategoryLabel(category)}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.chipsScroll, styles.priorityChipsScroll]}
      >
        {PRIORITIES.map((priority) => {
          const isActive = filters.priority === priority;
          const chipColor =
            priority === 'ALL' ? colors.primary : getPriorityColor(priority, colors);
          const PriorityIcon = PRIORITY_ICONS[priority];

          return (
            <TouchableOpacity
              key={priority}
              onPress={() => onFilterChange('priority', priority)}
              style={[
                styles.chip,
                {
                  backgroundColor: isActive ? chipColor : colors.surface,
                  borderColor: isActive ? chipColor : colors.border,
                },
              ]}
              activeOpacity={0.7}
            >
              <View style={styles.chipContent}>
                <PriorityIcon
                  size={14}
                  color={isActive ? '#FFFFFF' : colors.textSecondary}
                />
                <Text
                  style={[
                    styles.chipText,
                    typography.caption,
                    {
                      color: isActive ? '#FFFFFF' : colors.textSecondary,
                      fontWeight: isActive ? '700' : '500',
                    },
                  ]}
                >
                  {priority === 'ALL' ? 'All Priorities' : priority}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}

        {isFiltered && (
          <TouchableOpacity
            onPress={onResetFilters}
            style={[styles.resetChip, { borderColor: colors.error }]}
            activeOpacity={0.7}
          >
            <Text style={[styles.resetText, { color: colors.error }]}>Clear</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 6,
  },
  statusSegment: {
    flexDirection: 'row',
    borderRadius: 10,
    borderWidth: 1,
    padding: 3,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  statusTab: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
  },
  statusText: {
    fontSize: 13,
  },
  chipsScroll: {
    paddingHorizontal: 16,
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityChipsScroll: {
    marginTop: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  chipContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  chipText: {
    fontSize: 12,
  },
  resetChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
  },
  resetText: {
    fontSize: 11,
    fontWeight: '600',
  },
});
