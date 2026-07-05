const DashboardService = require('../services/DashboardService');

class DashboardController {
  async getOverview(req, res) {
    try {
      const overview = await DashboardService.getOverview();
      res.json({ code: 200, msg: 'success', data: overview });
    } catch (error) {
      res.status(400).json({ code: 400, msg: error.message });
    }
  }

  async getWorkerRanking(req, res) {
    try {
      const rankings = await DashboardService.getWorkerRanking();
      res.json({ code: 200, msg: 'success', data: rankings });
    } catch (error) {
      res.status(400).json({ code: 400, msg: error.message });
    }
  }

  async getWorkerStats(req, res) {
    try {
      const stats = await DashboardService.getWorkerStats(req.user.id);
      res.json({ code: 200, msg: 'success', data: stats });
    } catch (error) {
      res.status(400).json({ code: 400, msg: error.message });
    }
  }
}

module.exports = new DashboardController();
