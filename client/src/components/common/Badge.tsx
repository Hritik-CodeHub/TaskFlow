import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { getPriorityColor, getCategoryColor } from '../../theme/colors';
import { TaskPriority, TaskCategory, TaskStatus } from '../../types/task.types';
import { typography } from '../../theme/typography';

interface PriorityBadgeProps {
  priority: TaskPriority;
  size?: 'sm' | 'md';
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({
  priority,
  size = 'md',
}) => {
  const { colors } = useTheme();
  const color = getPriorityColor(priority, colors);

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: `${color}20`,
          borderColor: `${color}50`,
          paddingVertical: size === 'sm' ? 2 : 4,
          paddingHorizontal: size === 'sm' ? 6 : 8,
        },
      ]}
    >
      <View
        style={[
          styles.dot,
          {
            backgroundColor: color,
            width: size === 'sm' ? 5 : 6,
            height: size === 'sm' ? 5 : 6,
          },
        ]}
      />
      <Text
        style={[
          typography.captionSmall,
          {
            color: color,
            fontSize: size === 'sm' ? 9 : 11,
          },
        ]}
      >
        {priority}
      </Text>
    </View>
  );
};

interface CategoryBadgeProps {
  category: TaskCategory;
  size?: 'sm' | 'md';
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  category,
  size = 'md',
}) => {
  const { colors } = useTheme();
  const color = getCategoryColor(category, colors);

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: `${color}18`,
          borderColor: `${color}40`,
          paddingVertical: size === 'sm' ? 2 : 4,
          paddingHorizontal: size === 'sm' ? 6 : 8,
        },
      ]}
    >
      <Text
        style={[
          typography.captionSmall,
          {
            color: color,
            fontSize: size === 'sm' ? 9 : 11,
          },
        ]}
      >
        #{category.toLowerCase()}
      </Text>
    </View>
  );
};

interface StatusBadgeProps {
  status: TaskStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const { colors } = useTheme();
  const isCompleted = status === 'COMPLETED';
  const color = isCompleted ? colors.success : colors.warning;

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: `${color}18`,
          borderColor: `${color}40`,
          paddingVertical: 3,
          paddingHorizontal: 7,
        },
      ]}
    >
      <Text
        style={[
          typography.captionSmall,
          {
            color: color,
            fontSize: 10,
          },
        ]}
      >
        {isCompleted ? 'Done' : 'In Progress'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 6,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  dot: {
    borderRadius: 3,
    marginRight: 4,
  },
});
