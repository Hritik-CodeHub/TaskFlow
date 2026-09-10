import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  CalendarDays,
  Check,
  Clock3,
  PencilLine,
  Square,
  Trash2,
} from 'lucide-react-native';
import { Task } from '../../types/task.types';
import { useTheme } from '../../context/ThemeContext';
import { getPriorityColor } from '../../theme/colors';
import { PriorityBadge, CategoryBadge } from '../common/Badge';
import { getDeadlineStatus, formatDateTime } from '../../utils/dateUtils';
import { borderRadius, typography } from '../../theme/typography';

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onOpenDetails: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggle,
  onEdit,
  onDelete,
  onOpenDetails,
}) => {
  const { colors } = useTheme();
  const isCompleted = task.status === 'COMPLETED';
  const priorityColor = getPriorityColor(task.priority, colors);
  const deadlineInfo = getDeadlineStatus(task.deadline, isCompleted);

  const handleDeletePress = () => {
    Alert.alert(
      'Delete Task',
      `Are you sure you want to delete "${task.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDelete(task._id),
        },
      ]
    );
  };

  const getDeadlineBadgeColor = () => {
    if (deadlineInfo.colorType === 'danger') return colors.error;
    if (deadlineInfo.colorType === 'warning') return colors.warning;
    return colors.textSecondary;
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          opacity: isCompleted ? 0.75 : 1,
        },
      ]}
    >
      {/* Priority accent strip on left border */}
      <View
        style={[
          styles.priorityStrip,
          { backgroundColor: isCompleted ? colors.border : priorityColor },
        ]}
      />

      <View style={styles.cardContent}>
        {/* Top row: Checkbox, Title, and Action buttons */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => onToggle(task._id)}
            style={styles.checkboxTouch}
            activeOpacity={0.7}
          >
            {isCompleted ? (
              <Check size={22} color={colors.success} />
            ) : (
              <Square size={22} color={colors.textMuted} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onOpenDetails(task)}
            activeOpacity={0.8}
            style={styles.titleContainer}
          >
            <Text
              style={[
                styles.title,
                typography.h3,
                {
                  color: isCompleted ? colors.textMuted : colors.textPrimary,
                },
              ]}
              numberOfLines={2}
            >
              {task.title}
            </Text>
          </TouchableOpacity>

          {/* Quick actions: Edit and Delete */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              onPress={() => onEdit(task)}
              style={[styles.smallActionButton, { backgroundColor: colors.surfaceLight }]}
              activeOpacity={0.7}
            >
              <PencilLine size={14} color={colors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleDeletePress}
              style={[
                styles.smallActionButton,
                { backgroundColor: `${colors.error}15`, marginLeft: 6 },
              ]}
              activeOpacity={0.7}
            >
              <Trash2 size={14} color={colors.error} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Optional Description */}
        {task.description ? (
          <Text
            style={[
              styles.description,
              typography.body,
              {
                color: colors.textSecondary,
              },
            ]}
            numberOfLines={2}
          >
            {task.description}
          </Text>
        ) : null}

        {/* Date & Deadline row */}
        <View style={styles.datesRow}>
          {/* Scheduled date */}
          <View style={styles.dateItem}>
            <CalendarDays size={13} color={colors.textMuted} />
            <Text style={[styles.dateText, { color: colors.textMuted }]}>
              {formatDateTime(task.scheduledAt)}
            </Text>
          </View>

          {/* Deadline with urgency styling */}
          <View
            style={[
              styles.deadlineContainer,
              {
                backgroundColor:
                  deadlineInfo.isOverdue || deadlineInfo.isUrgent
                    ? `${getDeadlineBadgeColor()}18`
                    : colors.surfaceLight,
              },
            ]}
          >
            <Clock3 size={12} color={getDeadlineBadgeColor()} />
            <Text
              style={[
                styles.deadlineText,
                {
                  color: getDeadlineBadgeColor(),
                  fontWeight:
                    deadlineInfo.isOverdue || deadlineInfo.isUrgent
                      ? '700'
                      : '500',
                },
              ]}
            >
              {deadlineInfo.label}
            </Text>
          </View>
        </View>

        {/* Bottom tags: Priority and Category */}
        <View style={styles.badgesRow}>
          <PriorityBadge priority={task.priority} size="sm" />
          <View style={{ width: 6 }} />
          <CategoryBadge category={task.category} size="sm" />

          {task.tags && task.tags.length > 0 && (
            <View style={styles.tagsRow}>
              {task.tags.slice(0, 2).map((tag) => (
                <View
                  key={tag}
                  style={[
                    styles.tagBadge,
                    { backgroundColor: colors.surfaceLight },
                  ]}
                >
                  <Text style={[styles.tagText, { color: colors.textMuted }]}>
                    {tag}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    marginBottom: 12,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  priorityStrip: {
    width: 5,
  },
  cardContent: {
    flex: 1,
    padding: 14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkboxTouch: {
    paddingTop: 1,
    marginRight: 10,
  },
  titleContainer: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  smallActionButton: {
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  description: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 18,
  },
  datesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    flexWrap: 'wrap',
    gap: 6,
  },
  dateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 11,
    fontWeight: '500',
  },
  deadlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4,
  },
  deadlineText: {
    fontSize: 11,
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    flexWrap: 'wrap',
  },
  tagsRow: {
    flexDirection: 'row',
    marginLeft: 6,
  },
  tagBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 4,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '500',
  },
});
