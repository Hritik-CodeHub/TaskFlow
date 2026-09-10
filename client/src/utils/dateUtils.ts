/**
 * Date and time formatting helpers for TaskFlow
 */

export const formatDate = (dateInput: string | Date): string => {
  try {
    const d = new Date(dateInput);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return '';
  }
};

export const formatTime = (dateInput: string | Date): string => {
  try {
    const d = new Date(dateInput);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
};

export const formatDateTime = (dateInput: string | Date): string => {
  try {
    const d = new Date(dateInput);
    if (Number.isNaN(d.getTime())) return '';
    return `${formatDate(d)} • ${formatTime(d)}`;
  } catch {
    return '';
  }
};

export interface DeadlineInfo {
  label: string;
  isOverdue: boolean;
  isUrgent: boolean;
  colorType: 'danger' | 'warning' | 'normal' | 'muted';
}

/**
 * Returns user-friendly status badge for deadlines
 */
export const getDeadlineStatus = (
  deadlineStr: string,
  isCompleted: boolean = false
): DeadlineInfo => {
  if (isCompleted) {
    return {
      label: 'Completed',
      isOverdue: false,
      isUrgent: false,
      colorType: 'muted',
    };
  }

  const deadline = new Date(deadlineStr).getTime();
  if (Number.isNaN(deadline)) {
    return {
      label: 'No deadline',
      isOverdue: false,
      isUrgent: false,
      colorType: 'muted',
    };
  }

  const now = Date.now();
  const diffMs = deadline - now;
  const diffHours = diffMs / (1000 * 60 * 60);

  if (diffHours < 0) {
    const overdueHours = Math.abs(diffHours);
    if (overdueHours < 24) {
      return {
        label: `Overdue by ${Math.max(1, Math.round(overdueHours))}h`,
        isOverdue: true,
        isUrgent: true,
        colorType: 'danger',
      };
    }
    const overdueDays = Math.round(overdueHours / 24);
    return {
      label: `Overdue by ${overdueDays}d`,
      isOverdue: true,
      isUrgent: true,
      colorType: 'danger',
    };
  }

  if (diffHours <= 2) {
    return {
      label: `Due in ${Math.max(1, Math.round(diffHours * 60))}m`,
      isOverdue: false,
      isUrgent: true,
      colorType: 'danger',
    };
  }

  if (diffHours <= 24) {
    return {
      label: `Due in ${Math.round(diffHours)}h`,
      isOverdue: false,
      isUrgent: true,
      colorType: 'warning',
    };
  }

  if (diffHours <= 48) {
    return {
      label: 'Due tomorrow',
      isOverdue: false,
      isUrgent: false,
      colorType: 'warning',
    };
  }

  const days = Math.round(diffHours / 24);
  return {
    label: `Due in ${days}d`,
    isOverdue: false,
    isUrgent: false,
    colorType: 'normal',
  };
};
