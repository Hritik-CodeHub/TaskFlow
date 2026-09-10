import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { TaskPriority } from '../../types/task.types';
import { getPriorityColor } from '../../theme/colors';
import { borderRadius, typography } from '../../theme/typography';

interface PriorityDistributionProps {
  priorityBreakdown: Record<TaskPriority, number>;
  totalTasks: number;
}

export const PriorityDistribution: React.FC<PriorityDistributionProps> = ({
  priorityBreakdown,
  totalTasks,
}) => {
  const { colors } = useTheme();

  const priorities: TaskPriority[] = ['URGENT', 'HIGH', 'MEDIUM', 'LOW'];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
    >
      <Text
        style={[
          styles.heading,
          typography.h3,
          { color: colors.textPrimary },
        ]}
      >
        Priority Distribution
      </Text>

      {/* Multi-segment stacked progress bar */}
      <View
        style={[
          styles.stackedBar,
          { backgroundColor: colors.surfaceLight },
        ]}
      >
        {totalTasks === 0 ? (
          <View style={{ flex: 1, backgroundColor: colors.border }} />
        ) : (
          priorities.map((p) => {
            const count = priorityBreakdown[p] || 0;
            const percentage = (count / totalTasks) * 100;
            if (percentage === 0) return null;
            return (
              <View
                key={p}
                style={{
                  width: `${percentage}%`,
                  height: '100%',
                  backgroundColor: getPriorityColor(p, colors),
                }}
              />
            );
          })
        )}
      </View>

      {/* Legend list */}
      <View style={styles.legendContainer}>
        {priorities.map((p) => {
          const count = priorityBreakdown[p] || 0;
          const percentage =
            totalTasks > 0 ? Math.round((count / totalTasks) * 100) : 0;
          const pColor = getPriorityColor(p, colors);

          return (
            <View key={p} style={styles.legendItem}>
              <View style={styles.legendLeft}>
                <View style={[styles.colorDot, { backgroundColor: pColor }]} />
                <Text
                  style={[
                    styles.legendLabel,
                    typography.body,
                    { color: colors.textSecondary },
                  ]}
                >
                  {p}
                </Text>
              </View>

              <View style={styles.legendRight}>
                <Text
                  style={[
                    styles.countText,
                    typography.bodyMedium,
                    { color: colors.textPrimary },
                  ]}
                >
                  {count}
                </Text>
                <Text
                  style={[
                    styles.percentText,
                    typography.caption,
                    { color: colors.textMuted },
                  ]}
                >
                  ({percentage}%)
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    padding: 16,
    marginVertical: 8,
  },
  heading: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 14,
  },
  stackedBar: {
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
    flexDirection: 'row',
    marginBottom: 16,
  },
  legendContainer: {
    gap: 10,
  },
  legendItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  legendLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  legendLabel: {
    fontSize: 13,
  },
  legendRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  countText: {
    fontSize: 13,
    fontWeight: '700',
  },
  percentText: {
    fontSize: 12,
  },
});
