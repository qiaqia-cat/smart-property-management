const PropertyFeeService = require('../services/PropertyFeeService');

class PropertyFeeController {
  async getOwnerFees(req, res) {
    try {
      const { page = 1, pageSize = 10, status } = req.query;
      const result = await PropertyFeeService.getOwnerFees(
        req.user.id,
        Number(page),
        Number(pageSize),
        status
      );
      res.json({ code: 200, msg: 'success', data: result });
    } catch (error) {
      res.status(400).json({ code: 400, msg: error.message });
    }
  }

  async getAllFees(req, res) {
    try {
      const { page = 1, pageSize = 10, status } = req.query;
      const result = await PropertyFeeService.getAllFees(
        Number(page),
        Number(pageSize),
        status
      );
      res.json({ code: 200, msg: 'success', data: result });
    } catch (error) {
      res.status(400).json({ code: 400, msg: error.message });
    }
  }

  async payFee(req, res) {
    try {
      const fee = await PropertyFeeService.payFee(req.params.id, req.user.id);
      res.json({ code: 200, msg: '支付成功', data: fee });
    } catch (error) {
      res.status(400).json({ code: 400, msg: error.message });
    }
  }

  async batchCreateFees(req, res) {
    try {
      const result = await PropertyFeeService.batchCreateFees(req.body);
      res.json({ code: 200, msg: `成功生成${result.count}条账单`, data: result });
    } catch (error) {
      res.status(400).json({ code: 400, msg: error.message });
    }
  }

  async remindFee(req, res) {
    try {
      const fee = await PropertyFeeService.remindFee(req.params.id);
      res.json({ code: 200, msg: '已标记催缴', data: fee });
    } catch (error) {
      res.status(400).json({ code: 400, msg: error.message });
    }
  }
}

module.exports = new PropertyFeeController();
