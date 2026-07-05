const NotificationService = require('../services/NotificationService');

class NotificationController {
  async getNotifications(req, res) {
    const { page = 1, pageSize = 10 } = req.query;
    const result = await NotificationService.getUserNotifications(
      req.user.id,
      Number(page),
      Number(pageSize)
    );
    res.json({ code: 200, msg: 'success', data: result });
  }

  async getUnreadCount(req, res) {
    const result = await NotificationService.getUnreadCount(req.user.id);
    res.json({ code: 200, msg: 'success', data: result });
  }

  async markAsRead(req, res) {
    const notification = await NotificationService.markAsRead(
      req.user.id,
      req.params.id
    );
    res.json({ code: 200, msg: '已标记已读', data: notification });
  }

  async markAllAsRead(req, res) {
    await NotificationService.markAllAsRead(req.user.id);
    res.json({ code: 200, msg: '全部已读' });
  }

  async deleteNotification(req, res) {
    try {
      await NotificationService.deleteNotification(req.user.id, req.params.id);
      res.json({ code: 200, msg: '删除成功' });
    } catch (error) {
      res.status(400).json({ code: 400, msg: error.message });
    }
  }

  async batchDeleteNotifications(req, res) {
    try {
      const { ids } = req.body;
      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ code: 400, msg: '请选择要删除的消息' });
      }
      await NotificationService.batchDeleteNotifications(req.user.id, ids);
      res.json({ code: 200, msg: '批量删除成功' });
    } catch (error) {
      res.status(400).json({ code: 400, msg: error.message });
    }
  }
}

module.exports = new NotificationController();
