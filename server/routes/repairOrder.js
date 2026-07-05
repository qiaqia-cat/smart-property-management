const express = require('express');
const RepairOrderController = require('../controllers/RepairOrderController');
const { auth, requireAdmin, requireWorker } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// 图片上传（必须在 /:id 之前注册，否则 'upload' 会被当作 id）
router.post('/upload', auth, requireWorker, upload.single('file'), RepairOrderController.uploadImage);

router.post('/', auth, RepairOrderController.createOrder);
router.get('/owner', auth, RepairOrderController.getOwnerOrders);
router.get('/all', auth, requireAdmin, RepairOrderController.getAllOrders);
router.get('/worker', auth, requireWorker, RepairOrderController.getWorkerOrders);
router.put('/:id/cancel', auth, RepairOrderController.cancelOrder);
router.get('/:id', auth, RepairOrderController.getOrderDetail);
router.delete('/:id', auth, requireAdmin, RepairOrderController.deleteOrder);
router.put('/:id/assign', auth, requireAdmin, RepairOrderController.assignWorker);
router.put('/:id/accept', auth, requireWorker, RepairOrderController.acceptOrder);
router.put('/:id/complete', auth, requireWorker, RepairOrderController.completeOrder);
router.put('/:id/rate', auth, RepairOrderController.rateOrder);
router.get('/worker/stats', auth, requireWorker, RepairOrderController.getWorkerStats);
router.get('/worker/pending', auth, requireWorker, RepairOrderController.getPendingOrders);
router.get('/worker/completed', auth, requireWorker, RepairOrderController.getCompletedOrders);

module.exports = router;
