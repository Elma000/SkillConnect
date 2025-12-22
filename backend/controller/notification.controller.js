import express from "express";
import {
  createNotification,
  getNotificationsByUser,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications
} from "../service/notification.service.js";
import { checkAndNotifyIncompleteItems } from "../service/notificationChecker.service.js";

const notificationRoute = express.Router();

// Get all notifications for logged-in user
notificationRoute.get("/", async (req, res) => {
  if (!req.userId) return res.status(401).send("Unauthorized");
  
  const limit = parseInt(req.query.limit) || 20;
  const skip = parseInt(req.query.skip) || 0;
  const unreadOnly = req.query.unreadOnly === "true";
  
  try {
    const notifications = await getNotificationsByUser(req.userId, {
      limit,
      skip,
      unreadOnly
    });
    res.status(200).send(notifications);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// Get unread count
notificationRoute.get("/unread-count", async (req, res) => {
  if (!req.userId) return res.status(401).send("Unauthorized");
  
  try {
    const count = await getUnreadCount(req.userId);
    res.status(200).send({ count });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// Mark notification as read
notificationRoute.put("/:id/read", async (req, res) => {
  if (!req.userId) return res.status(401).send("Unauthorized");
  
  try {
    const notification = await markAsRead(req.params.id, req.userId);
    if (!notification) return res.status(404).send("Notification not found");
    res.status(200).send(notification);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// Mark all notifications as read
notificationRoute.put("/read-all", async (req, res) => {
  if (!req.userId) return res.status(401).send("Unauthorized");
  
  try {
    await markAllAsRead(req.userId);
    res.status(200).send({ message: "All notifications marked as read" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// Delete a notification
notificationRoute.delete("/:id", async (req, res) => {
  if (!req.userId) return res.status(401).send("Unauthorized");
  
  try {
    const notification = await deleteNotification(req.params.id, req.userId);
    if (!notification) return res.status(404).send("Notification not found");
    res.status(200).send({ message: "Notification deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// Delete all notifications
notificationRoute.delete("/", async (req, res) => {
  if (!req.userId) return res.status(401).send("Unauthorized");
  
  try {
    await deleteAllNotifications(req.userId);
    res.status(200).send({ message: "All notifications deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// Create a test notification (for development)
notificationRoute.post("/test", async (req, res) => {
  if (!req.userId) return res.status(401).send("Unauthorized");
  
  try {
    const notification = await createNotification({
      recipient: req.userId,
      type: "system",
      title: "Test Notification",
      message: "This is a test notification",
      ...req.body
    });
    res.status(201).send(notification);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// Check and send notifications for incomplete tasks and courses
notificationRoute.post("/check-incomplete", async (req, res) => {
  if (!req.userId) return res.status(401).send("Unauthorized");
  
  try {
    const forceSend = req.query.force === "true";
    const notifications = await checkAndNotifyIncompleteItems(req.userId, forceSend);
    res.status(200).send({
      message: `Checked incomplete items. Created ${notifications.length} notification(s).`,
      notifications,
    });
  } catch (err) {
    console.error("Error checking incomplete items:", err);
    res.status(500).send("Internal Server Error");
  }
});

export default notificationRoute;