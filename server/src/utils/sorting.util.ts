import { ITask, TaskPriority, TaskStatus } from "../interfaces/task.interface";

/**
 * Calculates a composite urgency score combining:
 * 1. Priority weight (Urgent > High > Medium > Low)
 * 2. Deadline proximity (Overdue > Due <24h > Due <3d > Due <7d)
 * 3. Scheduled time proximity (Scheduled for now/today)
 * 4. Completion penalty (Pushes finished tasks to the bottom)
 */
export const calculateTaskUrgencyScore = (task: ITask): number => {
  let score = 0;
  const now = Date.now();
  const deadlineTime = new Date(task.deadline).getTime();
  const scheduledTime = new Date(task.scheduledAt).getTime();

  // 1. Completion status penalty
  if (task.status === TaskStatus.COMPLETED) {
    return -1000 + deadlineTime / 10000000000; // Keep stable relative order at bottom
  }

  // 2. Priority scoring
  switch (task.priority) {
    case TaskPriority.URGENT:
      score += 100;
      break;
    case TaskPriority.HIGH:
      score += 65;
      break;
    case TaskPriority.MEDIUM:
      score += 35;
      break;
    case TaskPriority.LOW:
      score += 10;
      break;
    default:
      score += 20;
  }

  // 3. Deadline proximity scoring
  const diffHours = (deadlineTime - now) / (1000 * 60 * 60);

  if (diffHours < 0) {
    // Overdue task - highest urgency boost based on how overdue it is
    const overdueDays = Math.min(Math.abs(diffHours) / 24, 10);
    score += 150 + overdueDays * 5;
  } else if (diffHours <= 24) {
    // Due within 24 hours
    score += 90 + (24 - diffHours); // Closer to deadline gets higher score
  } else if (diffHours <= 72) {
    // Due within 3 days
    score += 50;
  } else if (diffHours <= 168) {
    // Due within 7 days
    score += 25;
  } else {
    // Due later
    score += 5;
  }

  // 4. Scheduled time proximity
  if (scheduledTime <= now) {
    // Already scheduled to have started
    score += 25;
  } else if (scheduledTime - now <= 24 * 60 * 60 * 1000) {
    // Scheduled for today
    score += 15;
  }

  return score;
};

/**
 * Sorts an array of tasks using the Smart Urgency & Priority Mix Algorithm
 */
export const smartSortTasks = <T extends ITask>(tasks: T[]): T[] => {
  return [...tasks].sort((a, b) => {
    const scoreA = calculateTaskUrgencyScore(a);
    const scoreB = calculateTaskUrgencyScore(b);

    if (scoreB !== scoreA) {
      return scoreB - scoreA; // Higher score comes first
    }

    // Tie-breaker: earlier deadline first
    return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
  });
};
