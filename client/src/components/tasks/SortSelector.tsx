import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import { ArrowUpDown, Check, X } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { SortOption } from '../../types/task.types';
import { borderRadius, typography } from '../../theme/typography';

interface SortSelectorProps {
  visible: boolean;
  currentSort: SortOption;
  onSelectSort: (sort: SortOption) => void;
  onClose: () => void;
}

interface SortItem {
  id: SortOption;
  title: string;
  description: string;
  isBonus?: boolean;
}

const SORT_ITEMS: SortItem[] = [
  {
    id: 'smart',
    title: 'Smart Urgency Mix (Recommended)',
    description:
      'Combines priority level, deadline proximity & scheduled time',
    isBonus: true,
  },
  {
    id: 'deadline',
    title: 'Deadline (Earliest First)',
    description: 'Sort by nearest due date',
  },
  {
    id: 'priority',
    title: 'Priority (Highest First)',
    description: 'Urgent > High > Medium > Low',
  },
  {
    id: 'scheduledAt',
    title: 'Scheduled Time',
    description: 'Sort by planned execution date',
  },
  {
    id: 'createdAt',
    title: 'Recently Added',
    description: 'Newest tasks first',
  },
];

export const SortSelector: React.FC<SortSelectorProps> = ({
  visible,
  currentSort,
  onSelectSort,
  onClose,
}) => {
  const { colors } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View
              style={[
                styles.modalCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              {/* Header */}
              <View style={styles.header}>
                <View style={styles.titleRow}>
                  <ArrowUpDown size={18} color={colors.primary} />
                  <Text
                    style={[
                      styles.modalTitle,
                      typography.h3,
                      { color: colors.textPrimary, marginLeft: 8 },
                    ]}
                  >
                    Sort Tasks
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={onClose}
                  style={[styles.closeButton, { backgroundColor: colors.surfaceLight }]}
                  activeOpacity={0.7}
                >
                  <X size={14} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>

              {/* Sort List */}
              <View style={styles.list}>
                {SORT_ITEMS.map((item) => {
                  const isSelected = currentSort === item.id;
                  return (
                    <TouchableOpacity
                      key={item.id}
                      onPress={() => {
                        onSelectSort(item.id);
                        onClose();
                      }}
                      style={[
                        styles.itemButton,
                        {
                          backgroundColor: isSelected
                            ? `${colors.primary}15`
                            : 'transparent',
                          borderColor: isSelected
                            ? colors.primary
                            : colors.border,
                        },
                      ]}
                      activeOpacity={0.7}
                    >
                      <View style={styles.itemContent}>
                        <View style={styles.itemTitleRow}>
                          <Text
                            style={[
                              styles.itemTitle,
                              typography.bodyMedium,
                              {
                                color: isSelected
                                  ? colors.primary
                                  : colors.textPrimary,
                              },
                            ]}
                          >
                            {item.title}
                          </Text>
                          {item.isBonus && (
                            <View
                              style={[
                                styles.smartBadge,
                                { backgroundColor: colors.primary },
                              ]}
                            >
                              <Text style={styles.smartBadgeText}>AI/Mix</Text>
                            </View>
                          )}
                        </View>
                        <Text
                          style={[
                            styles.itemDescription,
                            typography.caption,
                            { color: colors.textMuted },
                          ]}
                        >
                          {item.description}
                        </Text>
                      </View>

                      {isSelected && <Check size={18} color={colors.primary} />}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    gap: 10,
  },
  itemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: borderRadius.md,
    borderWidth: 1,
  },
  itemContent: {
    flex: 1,
    marginRight: 10,
  },
  itemTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  smartBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 4,
    marginLeft: 6,
  },
  smartBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  itemDescription: {
    fontSize: 11,
    marginTop: 2,
  },
});
