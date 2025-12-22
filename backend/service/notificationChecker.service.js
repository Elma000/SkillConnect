import { getIncompleteTasks } from "./task.service.js";
import { getIncompleteCourses } from "./course.service.js";
import {
  notifyIncompleteTask,
  notifyIncompleteCourse,
  getNotificationsByUser,
} from "./notification.service.js";

/**
 * Check for incomplete tasks and courses, and send notifications
 * @param {string} userId - User ID to check
 * @param {boolean} forceSend - If true, send notifications even if they already exist
 */
export const checkAndNotifyIncompleteItems = async (userId, forceSend = false) => {
  const notifications = [];

  // Check incomplete tasks
  const incompleteTasks = await getIncompleteTasks(userId);
  for (const task of incompleteTasks) {
    const incompleteGoals = (task.goals || []).filter((g) => !g.done);
    if (incompleteGoals.length > 0) {
      // Check if notification already exists for this task (within last 24 hours)
      if (!forceSend) {
        const recentNotifications = await getNotificationsByUser(userId, {
          limit: 100,
          skip: 0,
        });
        const existingNotification = recentNotifications.find(
          (n) =>
            n.type === "incomplete_task" &&
            n.metadata?.taskId?.toString() === task._id.toString() &&
            new Date(n.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
        );
        if (existingNotification) continue;
      }

      const notification = await notifyIncompleteTask(
        userId,
        task._id.toString(),
        task.title,
        incompleteGoals.length
      );
      notifications.push(notification);
    }
  }

  // Check incomplete courses
  const incompleteCourses = await getIncompleteCourses(userId);
  for (const course of incompleteCourses) {
    const incompleteLessons = (course.lessons || []).filter((l) => !l.completed);
    if (incompleteLessons.length > 0) {
      // Check if notification already exists for this course (within last 24 hours)
      if (!forceSend) {
        const recentNotifications = await getNotificationsByUser(userId, {
          limit: 100,
          skip: 0,
        });
        const existingNotification = recentNotifications.find(
          (n) =>
            n.type === "incomplete_course" &&
            n.metadata?.courseId?.toString() === course._id.toString() &&
            new Date(n.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
        );
        if (existingNotification) continue;
      }

      const notification = await notifyIncompleteCourse(
        userId,
        course._id.toString(),
        course.title,
        incompleteLessons.length
      );
      notifications.push(notification);
    }
  }

  return notifications;
};

/**
 * Check and notify all users about incomplete items
 */
export const checkAllUsersIncompleteItems = async () => {
  // This would require getting all users - for now, we'll handle per-user
  // In production, you might want to add a scheduled job that calls this
  // for each user or use a queue system
};

