const VisitorService = require('../services/VisitorService');

class VisitorController {
  async createVisitor(req, res) {
    try {
      const visitor = await VisitorService.createVisitor({
        ...req.body,
        owner_id: req.user.id,
      });
      res.json({ code: 200, msg: '登记成功', data: visitor });
    } catch (error) {
      res.status(400).json({ code: 400, msg: error.message });
    }
  }

  async getOwnerVisitors(req, res) {
    try {
      const { page = 1, pageSize = 10 } = req.query;
      const result = await VisitorService.getOwnerVisitors(
        req.user.id,
        Number(page),
        Number(pageSize)
      );
      res.json({ code: 200, msg: 'success', data: result });
    } catch (error) {
      res.status(400).json({ code: 400, msg: error.message });
    }
  }

  async updateVisitor(req, res) {
    try {
      const visitor = await VisitorService.updateVisitor(
        req.params.id,
        req.user.id,
        req.body
      );
      res.json({ code: 200, msg: '修改成功', data: visitor });
    } catch (error) {
      res.status(400).json({ code: 400, msg: error.message });
    }
  }

  async deleteVisitor(req, res) {
    try {
      await VisitorService.deleteVisitor(req.params.id, req.user.id);
      res.json({ code: 200, msg: '删除成功', data: null });
    } catch (error) {
      res.status(400).json({ code: 400, msg: error.message });
    }
  }
}

module.exports = new VisitorController();
