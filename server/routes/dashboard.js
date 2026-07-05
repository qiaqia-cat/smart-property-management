const express = require('express');
const DashboardController = require('../controllers/DashboardController');
const { auth, requireAdmin, requireWorker } = require('../middleware/auth');

const router = express.Router();

router.get('/overview', auth, requireAdmin, DashboardController.getOverview);
router.get('/ranking', auth, requireAdmin, DashboardController.getWorkerRanking);
router.get('/worker-stats', auth, requireWorker, DashboardController.getWorkerStats);

module.exports = router;