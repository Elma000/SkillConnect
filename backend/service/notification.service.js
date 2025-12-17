import { Schema, ObjectId, model } from "mongoose";

const notificationSchema = new Schema(
  {
    recipient: { type: ObjectId, ref: "users", required: true, index: true },
    sender: { type: ObjectId, ref: "users" },
    type: {
      type: String,
      required: true,
      enum: [
        "connection_request",
        "connection_accepted",
        "message",
        "profile_view",
        "skill_match",
        "task_reminder",
        "system"
      ]
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    link: { type: String }, // Optional link to related resource
    metadata: { type: Schema.Types.Mixed }, // Additional data
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
notificationSchema.index({ recipient: 1, read: 1, createdAt: -1 });

const Notification = model("notifications", notificationSchema);
export default Notification;

// Create a new notification
export const createNotification = async ({
  recipient,
  sender,
  type,
  title,
  message,
  link,
  metadata
}) => {
  const notification = new Notification({
    recipient,
    sender,
    type,
    title,
    message,
    link,
    metadata
  });
  return await notification.save();
};

// Get notifications for a user
export const getNotificationsByUser = async (userId, { limit = 20, skip = 0, unreadOnly = false } = {}) => {
  const query = { recipient: userId };
  if (unreadOnly) query.read = false;
  
  return await Notification.find(query)
    .populate("sender", "fullName profilePicture")
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);
};

// Get unread count
export const getUnreadCount = async (userId) => {
  return await Notification.countDocuments({ recipient: userId, read: false });
};

// Mark notification as read
export const markAsRead = async (notificationId, userId) => {
  return await Notification.findOneAndUpdate(
    { _id: notificationId, recipient: userId },
    { read: true },
    { new: true }
  );
};

// Mark all as read
export const markAllAsRead = async (userId) => {
  return await Notification.updateMany(
    { recipient: userId, read: false },
    { read: true }
  );
};

// Delete notification
export const deleteNotification = async (notificationId, userId) => {
  return await Notification.findOneAndDelete({
    _id: notificationId,
    recipient: userId
  });
};

// Delete all notifications for a user
export const deleteAllNotifications = async (userId) => {
  return await Notification.deleteMany({ recipient: userId });
};

// Helper function to create connection request notification
export const notifyConnectionRequest = async (senderId, recipientId, senderName) => {
  return createNotification({
    recipient: recipientId,
    sender: senderId,
    type: "connection_request",
    title: "New Connection Request",
    message: `${senderName} wants to connect with you`,
    link: `/profile/${senderId}`
  });
};

// Helper function to create connection accepted notification
export const notifyConnectionAccepted = async (senderId, recipientId, senderName) => {
  return createNotification({
    recipient: recipientId,
    sender: senderId,
    type: "connection_accepted",
    title: "Connection Accepted",
    message: `${senderName} accepted your connection request`,
    link: `/profile/${senderId}`
  });
};

// Helper function to create profile view notification
export const notifyProfileView = async (viewerId, profileOwnerId, viewerName) => {
  return createNotification({
    recipient: profileOwnerId,
    sender: viewerId,
    type: "profile_view",
    title: "Profile View",
    message: `${viewerName} viewed your profile`,
    link: `/profile/${viewerId}`
  });
};

// Helper function to create skill match notification
export const notifySkillMatch = async (userId, matchedUserId, matchedUserName, skill) => {
  return createNotification({
    recipient: userId,
    sender: matchedUserId,
    type: "skill_match",
    title: "Skill Match Found",
    message: `${matchedUserName} has expertise in ${skill}`,
    link: `/profile/${matchedUserId}`,
    metadata: { skill }
  });
};