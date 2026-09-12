import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { CalendarDays, Clock3, Flag, X } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import {
  Task,
  TaskPriority,
  TaskCategory,
  CreateTaskPayload,
  UpdateTaskPayload,
} from '../../types/task.types';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { getPriorityColor, getCategoryColor } from '../../theme/colors';
import { formatDateTime } from '../../utils/dateUtils';
import { borderRadius, typography } from '../../theme/typography';

interface AddEditTaskModalProps {
  visible: boolean;
  taskToEdit?: Task | null;
  onClose: () => void;
  onSubmitCreate: (payload: CreateTaskPayload) => Promise<boolean>;
  onSubmitUpdate: (id: string, payload: UpdateTaskPayload) => Promise<boolean>;
}

const PRIORITIES: TaskPriority[] = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
const CATEGORIES: TaskCategory[] = [
  'WORK',
  'PERSONAL',
  'STUDY',
  'HEALTH',
  'FINANCE',
  'OTHER',
];

export const AddEditTaskModal: React.FC<AddEditTaskModalProps> = ({
  visible,
  taskToEdit,
  onClose,
  onSubmitCreate,
  onSubmitUpdate,
}) => {
  const { colors } = useTheme();

  const isEditMode = !!taskToEdit;

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('MEDIUM');
  const [category, setCategory] = useState<TaskCategory>('WORK');
  const [tagsInput, setTagsInput] = useState('');
  const [scheduledAt, setScheduledAt] = useState<Date>(new Date());
  const [deadline, setDeadline] = useState<Date>(
    new Date(Date.now() + 24 * 60 * 60 * 1000)
  );
  const [pickerTarget, setPickerTarget] = useState<
    'scheduledAt' | 'deadline' | null
  >(null);
  const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');
  const [pickerVisible, setPickerVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [titleError, setTitleError] = useState<string | null>(null);

  // Sync state when modal opens or taskToEdit changes
  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description || '');
      setPriority(taskToEdit.priority);
      setCategory(taskToEdit.category);
      setTagsInput(taskToEdit.tags ? taskToEdit.tags.join(', ') : '');
      setScheduledAt(new Date(taskToEdit.scheduledAt));
      setDeadline(new Date(taskToEdit.deadline));
    } else {
      const now = new Date();
      setTitle('');
      setDescription('');
      setPriority('MEDIUM');
      setCategory('WORK');
      setTagsInput('');
      setScheduledAt(now);
      setDeadline(new Date(now.getTime() + 24 * 60 * 60 * 1000));
    }
    setTitleError(null);
  }, [taskToEdit, visible]);

  const openDateTimePicker = (target: 'scheduledAt' | 'deadline') => {
    setPickerTarget(target);
    setPickerMode('date');
    setPickerVisible(true);
  };

  const handleDateTimePickerChange = (
    event: any,
    selectedDate?: Date
  ) => {
    if (!pickerTarget || event.type === 'dismissed') {
      setPickerVisible(false);
      setPickerTarget(null);
      setPickerMode('date');
      return;
    }

    if (!selectedDate) {
      return;
    }

    const currentDate =
      pickerTarget === 'scheduledAt' ? scheduledAt : deadline;

    if (pickerMode === 'date') {
      const nextDate = new Date(currentDate);
      nextDate.setFullYear(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate()
      );

      if (pickerTarget === 'scheduledAt') {
        setScheduledAt(nextDate);
      } else {
        setDeadline(nextDate);
      }

      setPickerMode('time');
      return;
    }

    const nextDate = new Date(currentDate);
    nextDate.setHours(
      selectedDate.getHours(),
      selectedDate.getMinutes(),
      0,
      0
    );

    if (pickerTarget === 'scheduledAt') {
      setScheduledAt(nextDate);
    } else {
      setDeadline(nextDate);
    }

    setPickerVisible(false);
    setPickerTarget(null);
    setPickerMode('date');
  };

  // Quick preset helpers for scheduled time
  const setScheduledPreset = (hoursOffset: number) => {
    const d = new Date(Date.now() + hoursOffset * 60 * 60 * 1000);
    setScheduledAt(d);
    // If deadline is earlier than scheduled, push deadline forward
    if (deadline <= d) {
      setDeadline(new Date(d.getTime() + 24 * 60 * 60 * 1000));
    }
  };

  // Quick preset helpers for deadline
  const setDeadlinePreset = (daysOffset: number) => {
    const d = new Date(scheduledAt.getTime() + daysOffset * 24 * 60 * 60 * 1000);
    // Set to end of day
    d.setHours(23, 59, 0, 0);
    setDeadline(d);
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      setTitleError('Task title is required');
      return;
    }

    if (deadline < scheduledAt) {
      Alert.alert(
        'Invalid Dates',
        'The deadline cannot be earlier than the scheduled date/time.'
      );
      return;
    }

    setLoading(true);

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    let success = false;

    if (isEditMode && taskToEdit) {
      const payload: UpdateTaskPayload = {
        title: title.trim(),
        description: description.trim(),
        priority,
        category,
        tags,
        scheduledAt: scheduledAt.toISOString(),
        deadline: deadline.toISOString(),
      };
      success = await onSubmitUpdate(taskToEdit._id, payload);
    } else {
      const payload: CreateTaskPayload = {
        title: title.trim(),
        description: description.trim(),
        priority,
        category,
        tags,
        scheduledAt: scheduledAt.toISOString(),
        deadline: deadline.toISOString(),
      };
      success = await onSubmitCreate(payload);
    }

    setLoading(false);
    if (success) {
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.modalOverlay}
      >
        <View
          style={[
            styles.modalContainer,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <Text
              style={[styles.headerTitle, typography.h2, { color: colors.textPrimary }]}
            >
              {isEditMode ? 'Edit Task' : 'Create New Task'}
            </Text>
            <TouchableOpacity
              onPress={onClose}
              style={[styles.closeButton, { backgroundColor: colors.surfaceLight }]}
              activeOpacity={0.7}
            >
              <X size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Title Input */}
            <Input
              label="Task Title *"
              placeholder="e.g. Prepare quarterly presentation"
              value={title}
              onChangeText={(text) => {
                setTitle(text);
                if (titleError) setTitleError(null);
              }}
              error={titleError}
            />

            {/* Description Input */}
            <Input
              label="Description (Optional)"
              placeholder="Add extra context, checklist, or notes..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              containerStyle={{ minHeight: 80 }}
            />

            {/* Priority Selector */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionTitleRow}>
                <Flag size={15} color={colors.primary} />
                <Text
                  style={[
                    styles.sectionTitle,
                    typography.caption,
                    { color: colors.textSecondary, marginLeft: 6 },
                  ]}
                >
                  Priority Level
                </Text>
              </View>
              <View style={styles.buttonGroup}>
                {PRIORITIES.map((p) => {
                  const isSelected = priority === p;
                  const pColor = getPriorityColor(p, colors);
                  return (
                    <TouchableOpacity
                      key={p}
                      onPress={() => setPriority(p)}
                      style={[
                        styles.priorityButton,
                        {
                          backgroundColor: isSelected
                            ? `${pColor}25`
                            : colors.surfaceLight,
                          borderColor: isSelected ? pColor : colors.border,
                        },
                      ]}
                      activeOpacity={0.7}
                    >
                      <View
                        style={[styles.priorityDot, { backgroundColor: pColor }]}
                      />
                      <Text
                        style={[
                          styles.priorityText,
                          {
                            color: isSelected ? pColor : colors.textSecondary,
                            fontWeight: isSelected ? '700' : '500',
                          },
                        ]}
                      >
                        {p}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Category Selector */}
            <View style={styles.sectionContainer}>
              <Text
                style={[
                  styles.sectionTitle,
                  typography.caption,
                  { color: colors.textSecondary },
                ]}
              >
                Category
              </Text>
              <View style={styles.categoryGrid}>
                {CATEGORIES.map((c) => {
                  const isSelected = category === c;
                  const cColor = getCategoryColor(c, colors);
                  return (
                    <TouchableOpacity
                      key={c}
                      onPress={() => setCategory(c)}
                      style={[
                        styles.categoryButton,
                        {
                          backgroundColor: isSelected
                            ? `${cColor}22`
                            : colors.surfaceLight,
                          borderColor: isSelected ? cColor : colors.border,
                        },
                      ]}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.categoryText,
                          {
                            color: isSelected ? cColor : colors.textSecondary,
                            fontWeight: isSelected ? '700' : '500',
                          },
                        ]}
                      >
                        #{c.toLowerCase()}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Scheduled Date & Time Selection */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionTitleRow}>
                <CalendarDays size={15} color={colors.primary} />
                <Text
                  style={[
                    styles.sectionTitle,
                    typography.caption,
                    { color: colors.textSecondary, marginLeft: 6 },
                  ]}
                >
                  Scheduled Start Time:
                </Text>
              </View>

              {/* Preview badge */}
              <View
                style={[
                  styles.datePreviewBox,
                  { backgroundColor: colors.surfaceLight, borderColor: colors.border },
                ]}
              >
                <Text
                  style={[styles.datePreviewText, { color: colors.textPrimary }]}
                >
                  {formatDateTime(scheduledAt)}
                </Text>
              </View>

              <View style={styles.actionRow}>
                <TouchableOpacity
                  onPress={() => openDateTimePicker('scheduledAt')}
                  style={[
                    styles.actionButton,
                    { backgroundColor: colors.primary, borderColor: colors.primary },
                  ]}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.actionButtonText, { color: '#FFFFFF' }]}>
                    Pick Date & Time
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Presets */}
              <View style={styles.presetsRow}>
                <TouchableOpacity
                  onPress={() => setScheduledPreset(0)}
                  style={[styles.presetChip, { borderColor: colors.border }]}
                >
                  <Text style={[styles.presetText, { color: colors.textSecondary }]}>
                    Now
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setScheduledPreset(4)}
                  style={[styles.presetChip, { borderColor: colors.border }]}
                >
                  <Text style={[styles.presetText, { color: colors.textSecondary }]}>
                    +4 Hours
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setScheduledPreset(24)}
                  style={[styles.presetChip, { borderColor: colors.border }]}
                >
                  <Text style={[styles.presetText, { color: colors.textSecondary }]}>
                    Tomorrow
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Deadline Selection */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionTitleRow}>
                <Clock3 size={15} color={colors.error} />
                <Text
                  style={[
                    styles.sectionTitle,
                    typography.caption,
                    { color: colors.textSecondary, marginLeft: 6 },
                  ]}
                >
                  Deadline / Due Date:
                </Text>
              </View>

              {/* Preview badge */}
              <View
                style={[
                  styles.datePreviewBox,
                  {
                    backgroundColor: `${colors.error}10`,
                    borderColor: `${colors.error}40`,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.datePreviewText,
                    { color: colors.error, fontWeight: '700' },
                  ]}
                >
                  {formatDateTime(deadline)}
                </Text>
              </View>

              <View style={styles.actionRow}>
                <TouchableOpacity
                  onPress={() => openDateTimePicker('deadline')}
                  style={[
                    styles.actionButton,
                    {
                      backgroundColor: `${colors.error}15`,
                      borderColor: `${colors.error}60`,
                    },
                  ]}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.actionButtonText, { color: colors.error }]}>
                    Pick Date & Time
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Presets */}
              <View style={styles.presetsRow}>
                <TouchableOpacity
                  onPress={() => setDeadlinePreset(1)}
                  style={[styles.presetChip, { borderColor: colors.border }]}
                >
                  <Text style={[styles.presetText, { color: colors.textSecondary }]}>
                    Tomorrow
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setDeadlinePreset(3)}
                  style={[styles.presetChip, { borderColor: colors.border }]}
                >
                  <Text style={[styles.presetText, { color: colors.textSecondary }]}>
                    +3 Days
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setDeadlinePreset(7)}
                  style={[styles.presetChip, { borderColor: colors.border }]}
                >
                  <Text style={[styles.presetText, { color: colors.textSecondary }]}>
                    Next Week
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Tags Input */}
            <Input
              label="Tags (comma separated)"
              placeholder="e.g. urgent, backend, design"
              value={tagsInput}
              onChangeText={setTagsInput}
            />

            <View style={{ height: 20 }} />
          </ScrollView>

          {pickerVisible && pickerTarget && (
            <DateTimePicker
              value={pickerTarget === 'scheduledAt' ? scheduledAt : deadline}
              mode={pickerMode}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateTimePickerChange}
            />
          )}

          {/* Footer Submit Button */}
          <View style={[styles.footer, { borderTopColor: colors.border }]}>
            <Button
              title={
                isEditMode
                  ? 'Save Task Changes'
                  : 'Create Task'
              }
              onPress={handleSubmit}
              loading={loading}
              size="lg"
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    maxHeight: '90%',
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    borderWidth: 1,
    borderBottomWidth: 0,
    paddingBottom: 34,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  sectionContainer: {
    marginBottom: 16,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: 6,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: borderRadius.sm,
    borderWidth: 1.5,
    gap: 6,
  },
  priorityDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  priorityText: {
    fontSize: 12,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 12,
  },
  datePreviewBox: {
    padding: 10,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 8,
  },
  datePreviewText: {
    fontSize: 14,
    fontWeight: '600',
  },
  actionRow: {
    marginBottom: 8,
  },
  actionButton: {
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    paddingVertical: 8,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '700',
  },
  presetsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  presetChip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
  },
  presetText: {
    fontSize: 12,
    fontWeight: '500',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
});
