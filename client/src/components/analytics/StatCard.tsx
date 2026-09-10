import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { borderRadius, typography } from '../../theme/typography';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  accentColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  accentColor,
}) => {
  const { colors } = useTheme();
  const color = accentColor || colors.primary;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={styles.topRow}>
        <Text style={[styles.title, typography.caption, { color: colors.textSecondary }]}>
          {title}
        </Text>
        {icon && (
          <View
            style={[
              styles.iconWrapper,
              { backgroundColor: `${color}18` },
            ]}
          >
            {icon}
          </View>
        )}
      </View>

      <Text style={[styles.value, typography.h1, { color: color }]}>
        {value}
      </Text>

      {subtitle && (
        <Text style={[styles.subtitle, typography.caption, { color: colors.textMuted }]}>
          {subtitle}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    padding: 16,
    flex: 1,
    minWidth: 140,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontWeight: '600',
  },
  iconWrapper: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: 26,
    fontWeight: '800',
  },
  subtitle: {
    marginTop: 4,
    fontSize: 11,
  },
});
