const express = require('express');
const NotificationController = require('../controllers/NotificationController');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, NotificationController.getNotifications);
router.get('/unread-count', auth, NotificationController.getUnreadCount);
router.put('/:id/read', auth, NotificationController.markAsRead);
router.put('/read-all', auth, NotificationController.markAllAsRead);
router.delete('/:id', auth, NotificationController.deleteNotification);
router.delete('/', auth, NotificationController.batchDeleteNotifications);

module.exports = router;
