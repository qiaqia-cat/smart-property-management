const ComplaintService = require('../services/ComplaintService');

class ComplaintController {
  async createComplaint(req, res) {
    try {
      const complaint = await ComplaintService.createComplaint({
        ...req.body,
        owner_id: req.user.id,
      });
      res.json({ code: 200, msg: '提交成功', data: complaint });
    } catch (error) {
      res.status(400).json({ code: 400, msg: error.message });
    }
  }

  async getOwnerComplaints(req, res) {
    try {
      const { page = 1, pageSize = 10 } = req.query;
      const result = await ComplaintService.getOwnerComplaints(
        req.user.id,
        Number(page),
        Number(pageSize)
      );
      res.json({ code: 200, msg: 'success', data: result });
    } catch (error) {
      res.status(400).json({ code: 400, msg: error.message });
    }
  }

  async getAllComplaints(req, res) {
    try {
      const { page = 1, pageSize = 10, status } = req.query;
      const result = await ComplaintService.getAllComplaints(
        Number(page),
        Number(pageSize),
        status
      );
      res.json({ code: 200, msg: 'success', data: result });
    } catch (error) {
      res.status(400).json({ code: 400, msg: error.message });
    }
  }

  async getComplaintDetail(req, res) {
    try {
      const complaint = await ComplaintService.getComplaintDetail(req.params.id);
      res.json({ code: 200, msg: 'success', data: complaint });
    } catch (error) {
      res.status(400).json({ code: 400, msg: error.message });
    }
  }

  async handleComplaint(req, res) {
    try {
      const complaint = await ComplaintService.handleComplaint(
        req.params.id,
        req.user.id,
        req.body
      );
      res.json({ code: 200, msg: '处理成功', data: complaint });
    } catch (error) {
      res.status(400).json({ code: 400, msg: error.message });
    }
  }

  async deleteComplaint(req, res) {
    try {
      await ComplaintService.deleteComplaint(req.params.id);
      res.json({ code: 200, msg: '删除成功' });
    } catch (error) {
      res.status(400).json({ code: 400, msg: error.message });
    }
  }
}

module.exports = new ComplaintController();
