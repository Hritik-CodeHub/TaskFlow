import React from 'react';
import {
  Modal,
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { CalendarDays, Clock3, Flag, X } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { Task } from '../../types/task.types';
import { Button } from '../common/Button';
import { PriorityBadge, CategoryBadge, StatusBadge } from '../common/Badge';
import { borderRadius, typography } from '../../theme/typography';
import { formatDateTime } from '../../utils/dateUtils';

interface TaskDetailModalProps {
  visible: boolean;
  task: Task | null;
  onClose: () => void;
  onEdit: (task: Task) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  visible,
  task,
  onClose,
  onEdit,
  onToggle,
  onDelete,
}) => {
  const { colors } = useTheme();

  if (!task) {
    return null;
  }

  const handleDelete = () => {
    Alert.alert(
      'Delete task',
      `Are you sure you want to remove "${task.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            onDelete(task._id);
            onClose();
          },
        },
      ]
    );
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View
          style={[
            styles.modalCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <View style={styles.headerTextWrap}>
              <Text style={[styles.headerTitle, typography.h2, { color: colors.textPrimary }]}>
                Task Details
              </Text>
              <Text style={[styles.headerSubtitle, { color: colors.textMuted }]}>
                Review task information and make quick updates
              </Text>
            </View>

            <TouchableOpacity
              onPress={onClose}
              style={[styles.closeButton, { backgroundColor: colors.surfaceLight }]}
              activeOpacity={0.7}
            >
              <X size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
            <View style={styles.titleRow}>
              <Text style={[styles.title, typography.h2, { color: colors.textPrimary }]}>
                {task.title}
              </Text>
              <StatusBadge status={task.status} />
            </View>

            <View style={styles.badgesRow}>
              <PriorityBadge priority={task.priority} />
              <View style={styles.badgeSpacer} />
              <CategoryBadge category={task.category} />
            </View>

            {task.description ? (
              <View style={[styles.infoBlock, { backgroundColor: colors.surfaceLight, borderColor: colors.border }]}>
                <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>Description</Text>
                <Text style={[styles.description, { color: colors.textSecondary }]}>
                  {task.description}
                </Text>
              </View>
            ) : null}

            <View style={styles.metaGrid}>
              <View style={[styles.metaCard, { backgroundColor: colors.surfaceLight, borderColor: colors.border }]}>
                <View style={styles.metaHeader}>
                  <CalendarDays size={16} color={colors.primary} />
                  <Text style={[styles.metaLabel, { color: colors.textSecondary }]}>Scheduled</Text>
                </View>
                <Text style={[styles.metaValue, { color: colors.textPrimary }]}>
                  {formatDateTime(task.scheduledAt)}
                </Text>
              </View>

              <View style={[styles.metaCard, { backgroundColor: colors.surfaceLight, borderColor: colors.border }]}>
                <View style={styles.metaHeader}>
                  <Clock3 size={16} color={colors.error} />
                  <Text style={[styles.metaLabel, { color: colors.textSecondary }]}>Deadline</Text>
                </View>
                <Text style={[styles.metaValue, { color: colors.textPrimary }]}>
                  {formatDateTime(task.deadline)}
                </Text>
              </View>
            </View>

            {task.tags && task.tags.length > 0 && (
              <View style={styles.tagSection}>
                <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>Tags</Text>
                <View style={styles.tagRow}>
                  {task.tags.map((tag, index) => (
                    <View
                      key={`${tag}-${index}`}
                      style={[
                        styles.tag,
                        { backgroundColor: colors.surfaceLight, borderColor: colors.border },
                      ]}
                    >
                      <Text style={[styles.tagText, { color: colors.textSecondary }]}>{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            <View style={styles.sectionLabelRow}>
              <Flag size={15} color={colors.primary} />
              <Text style={[styles.sectionLabel, { color: colors.textMuted, marginLeft: 6 }]}>Quick actions</Text>
            </View>
          </ScrollView>

          <View style={[styles.footer, { borderTopColor: colors.border }]}> 
            <Button
              title={task.status === 'COMPLETED' ? 'Mark as Open' : 'Mark as Done'}
              variant="secondary"
              onPress={() => {
                onToggle(task._id);
                onClose();
              }}
            />
            <View style={styles.footerActions}>
              <Button title="Edit" variant="outline" onPress={() => {
                onEdit(task);
                onClose();
              }} />
              <Button title="Delete" variant="danger" onPress={handleDelete} />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    maxHeight: '92%',
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    borderWidth: 1,
    borderBottomWidth: 0,
    paddingBottom: 34,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTextWrap: {
    flex: 1,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 12,
  },
  title: {
    flex: 1,
    fontWeight: '700',
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  badgeSpacer: {
    width: 8,
  },
  infoBlock: {
    borderRadius: borderRadius.md,
    borderWidth: 1,
    padding: 14,
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '700',
  },
  description: {
    marginTop: 8,
    lineHeight: 22,
    fontSize: 14,
  },
  metaGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  metaCard: {
    flex: 1,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    padding: 12,
  },
  metaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metaLabel: {
    fontSize: 12,
    marginLeft: 6,
  },
  metaValue: {
    fontSize: 13,
    lineHeight: 18,
  },
  tagSection: {
    marginBottom: 16,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  tag: {
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
  },
  sectionLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  footer: {
    borderTopWidth: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  footerActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
});
