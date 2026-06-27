const { promisePool: db } = require("../config/db");

/**
 * Create a notification and emit it via Socket.IO
 * @param {number} userId - Target user's ID
 * @param {string} message - Notification message
 * @param {string} type - Notification type (default: 'general')
 * @param {string|null} link - Optional link for the notification
 * @param {object|null} io - Socket.IO server instance (optional)
 */
const createNotification = async (userId, message, type = "general", link = null, io = null) => {
  try {
    if (!userId || !message) {
      console.warn("⚠ Invalid notification data");
      return null;
    }

    const cleanMessage = message.trim();

    const [result] = await db.query(
      "INSERT INTO notifications (user_id, message, is_read, type, link) VALUES (?, ?, 0, ?, ?)",
      [userId, cleanMessage, type, link]
    );

    const notification = {
      id: result.insertId,
      user_id: userId,
      message: cleanMessage,
      is_read: 0,
      type,
      link,
      created_at: new Date(),
    };

    // Emit real-time notification via socket if io is provided
    if (io) {
      // Emit to the user's personal room (username-based room)
      const [userRows] = await db.query("SELECT username FROM users WHERE id = ?", [userId]);
      if (userRows.length) {
        io.to(userRows[0].username).emit("newNotification", notification);
      }
    }

    return result.insertId;
  } catch (err) {
    console.error("Notification error:", err);
    return null;
  }
};

module.exports = { createNotification };
