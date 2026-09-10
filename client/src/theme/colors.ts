export interface ThemeColors {
  isDark: boolean;
  background: string;
  surface: string;
  surfaceLight: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  primary: string;
  primaryLight: string;
  primaryDark: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
  cardShadow: string;
  // Priority colors
  priorityUrgent: string;
  priorityHigh: string;
  priorityMedium: string;
  priorityLow: string;
  // Category colors
  categoryWork: string;
  categoryPersonal: string;
  categoryStudy: string;
  categoryHealth: string;
  categoryFinance: string;
  categoryOther: string;
}

export const darkColors: ThemeColors = {
  isDark: true,
  background: '#0B0F19',
  surface: '#131B2E',
  surfaceLight: '#1E293B',
  border: '#22304A',
  textPrimary: '#F8FAFC',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  primary: '#6366F1',
  primaryLight: '#818CF8',
  primaryDark: '#4F46E5',
  accent: '#EC4899',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  cardShadow: 'rgba(0, 0, 0, 0.4)',
  priorityUrgent: '#F43F5E',
  priorityHigh: '#F97316',
  priorityMedium: '#0284C7',
  priorityLow: '#10B981',
  categoryWork: '#8B5CF6',
  categoryPersonal: '#EC4899',
  categoryStudy: '#3B82F6',
  categoryHealth: '#10B981',
  categoryFinance: '#F59E0B',
  categoryOther: '#64748B',
};

export const lightColors: ThemeColors = {
  isDark: false,
  background: '#F1F5F9',
  surface: '#FFFFFF',
  surfaceLight: '#F8FAFC',
  border: '#E2E8F0',
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  primary: '#4F46E5',
  primaryLight: '#6366F1',
  primaryDark: '#3730A3',
  accent: '#DB2777',
  success: '#059669',
  warning: '#D97706',
  error: '#DC2626',
  cardShadow: 'rgba(15, 23, 42, 0.08)',
  priorityUrgent: '#E11D48',
  priorityHigh: '#EA580C',
  priorityMedium: '#0284C7',
  priorityLow: '#059669',
  categoryWork: '#7C3AED',
  categoryPersonal: '#DB2777',
  categoryStudy: '#2563EB',
  categoryHealth: '#059669',
  categoryFinance: '#D97706',
  categoryOther: '#64748B',
};

export const getPriorityColor = (priority: string, colors: ThemeColors): string => {
  switch (priority) {
    case 'URGENT':
      return colors.priorityUrgent;
    case 'HIGH':
      return colors.priorityHigh;
    case 'MEDIUM':
      return colors.priorityMedium;
    case 'LOW':
      return colors.priorityLow;
    default:
      return colors.primary;
  }
};

export const getCategoryColor = (category: string, colors: ThemeColors): string => {
  switch (category) {
    case 'WORK':
      return colors.categoryWork;
    case 'PERSONAL':
      return colors.categoryPersonal;
    case 'STUDY':
      return colors.categoryStudy;
    case 'HEALTH':
      return colors.categoryHealth;
    case 'FINANCE':
      return colors.categoryFinance;
    default:
      return colors.categoryOther;
  }
};
