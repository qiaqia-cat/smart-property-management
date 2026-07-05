const Notification = require('../models/Notification');

class NotificationService {
  async getUserNotifications(userId, page = 1, pageSize = 10) {
    const { count, rows } = await Notification.findAndCountAll({
      where: { user_id: userId },
      order: [['create_time', 'DESC']],
      offset: (page - 1) * pageSize,
      limit: pageSize,
    });

    return { notifications: rows, total: count };
  }

  async getUnreadCount(userId) {
    const count = await Notification.count({
      where: { user_id: userId, is_read: 0 },
    });

    return { count };
  }

  async markAsRead(userId, notificationId) {
    const notification = await Notification.findOne({
      where: { id: notificationId, user_id: userId },
    });

    if (!notification) {
      throw new Error('通知不存在');
    }

    await notification.update({ is_read: 1 });
    return notification;
  }

  async markAllAsRead(userId) {
    await Notification.update(
      { is_read: 1 },
      { where: { user_id: userId, is_read: 0 } }
    );
    return { count: await Notification.count({ where: { user_id: userId } }) };
  }

  async createNotification(userId, title, content, type = 'system') {
    return await Notification.create({
      user_id: userId,
      title,
      content,
      type,
      is_read: 0,
    });
  }

  async deleteNotification(userId, notificationId) {
    const notification = await Notification.findOne({
      where: { id: notificationId, user_id: userId },
    });

    if (!notification) {
      throw new Error('通知不存在');
    }

    await notification.destroy();
    return { id: notificationId };
  }

  async batchDeleteNotifications(userId, ids) {
    const result = await Notification.destroy({
      where: {
        id: ids,
        user_id: userId,
      },
    });

    return { deleted: result };
  }
}

module.exports = new NotificationService();
