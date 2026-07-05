const AnnouncementService = require('../services/AnnouncementService');

class AnnouncementController {
  async createAnnouncement(req, res) {
    try {
      const announcement = await AnnouncementService.createAnnouncement({
        ...req.body,
        publisher_id: req.user.id,
      });
      res.json({ code: 200, msg: '发布成功', data: announcement });
    } catch (error) {
      res.status(400).json({ code: 400, msg: error.message });
    }
  }

  async getAllAnnouncements(req, res) {
    try {
      const { page = 1, pageSize = 10 } = req.query;
      const result = await AnnouncementService.getAllAnnouncements(
        Number(page),
        Number(pageSize)
      );
      res.json({ code: 200, msg: 'success', data: result });
    } catch (error) {
      res.status(400).json({ code: 400, msg: error.message });
    }
  }

  async getAnnouncementDetail(req, res) {
    try {
      const announcement = await AnnouncementService.getAnnouncementDetail(req.params.id);
      res.json({ code: 200, msg: 'success', data: announcement });
    } catch (error) {
      res.status(400).json({ code: 400, msg: error.message });
    }
  }

  async updateAnnouncement(req, res) {
    try {
      const announcement = await AnnouncementService.updateAnnouncement(
        req.params.id,
        req.body
      );
      res.json({ code: 200, msg: '修改成功', data: announcement });
    } catch (error) {
      res.status(400).json({ code: 400, msg: error.message });
    }
  }

  async deleteAnnouncement(req, res) {
    try {
      const result = await AnnouncementService.deleteAnnouncement(req.params.id);
      res.json({ code: 200, msg: result.msg });
    } catch (error) {
      res.status(400).json({ code: 400, msg: error.message });
    }
  }
}

module.exports = new AnnouncementController();
