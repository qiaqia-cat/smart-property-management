const RepairOrderService = require('../services/RepairOrderService');

class RepairOrderController {
  async createOrder(req, res) {
    try {
      const order = await RepairOrderService.createOrder({
        ...req.body,
        owner_id: req.user.id,
      });
      res.json({ code: 200, msg: '提交成功', data: order });
    } catch (error) {
      res.status(400).json({ code: 400, msg: error.message });
    }
  }

  async getOwnerOrders(req, res) {
    try {
      const { page = 1, pageSize = 10 } = req.query;
      const result = await RepairOrderService.getOwnerOrders(
        req.user.id,
        Number(page),
        Number(pageSize)
      );
      res.json({ code: 200, msg: 'success', data: result });
    } catch (error) {
      res.status(400).json({ code: 400, msg: error.message });
    }
  }

  async getAllOrders(req, res) {
    try {
      const { page = 1, pageSize = 10, status } = req.query;
      const result = await RepairOrderService.getAllOrders(
        Number(page),
        Number(pageSize),
        status
      );
      res.json({ code: 200, msg: 'success', data: result });
    } catch (error) {
      res.status(400).json({ code: 400, msg: error.message });
    }
  }

  async getWorkerOrders(req, res) {
    try {
      const { page = 1, pageSize = 10 } = req.query;
      const result = await RepairOrderService.getWorkerOrders(
        req.user.id,
        Number(page),
        Number(pageSize)
      );
      res.json({ code: 200, msg: 'success', data: result });
    } catch (error) {
      res.status(400).json({ code: 400, msg: error.message });
    }
  }

  async getOrderDetail(req, res) {
    try {
      const order = await RepairOrderService.getOrderDetail(req.params.id);
      res.json({ code: 200, msg: 'success', data: order });
    } catch (error) {
      res.status(400).json({ code: 400, msg: error.message });
    }
  }

  async assignWorker(req, res) {
    try {
      const order = await RepairOrderService.assignWorker(req.params.id, req.body.worker_id);
      res.json({ code: 200, msg: '分派成功', data: order });
    } catch (error) {
      res.status(400).json({ code: 400, msg: error.message });
    }
  }

  async acceptOrder(req, res) {
    try {
      const order = await RepairOrderService.acceptOrder(req.params.id, req.user.id);
      res.json({ code: 200, msg: '接单成功', data: order });
    } catch (error) {
      res.status(400).json({ code: 400, msg: error.message });
    }
  }

  async completeOrder(req, res) {
    try {
      const order = await RepairOrderService.completeOrder(req.params.id, req.user.id, req.body);
      res.json({ code: 200, msg: '完工提交成功', data: order });
    } catch (error) {
      res.status(400).json({ code: 400, msg: error.message });
    }
  }

  async rateOrder(req, res) {
    try {
      const order = await RepairOrderService.rateOrder(req.params.id, req.user.id, req.body);
      res.json({ code: 200, msg: '评价成功', data: order });
    } catch (error) {
      res.status(400).json({ code: 400, msg: error.message });
    }
  }

  async cancelOrder(req, res) {
    try {
      await RepairOrderService.cancelOrder(req.params.id, req.user.id);
      res.json({ code: 200, msg: '撤销成功', data: null });
    } catch (error) {
      res.status(400).json({ code: 400, msg: error.message });
    }
  }

  async deleteOrder(req, res) {
    try {
      await RepairOrderService.deleteOrder(req.params.id);
      res.json({ code: 200, msg: '删除成功', data: null });
    } catch (error) {
      res.status(400).json({ code: 400, msg: error.message });
    }
  }

  async getWorkerStats(req, res) {
    try {
      const stats = await RepairOrderService.getWorkerStats(req.user.id);
      res.json({ code: 200, msg: 'success', data: stats });
    } catch (error) {
      res.status(400).json({ code: 400, msg: error.message });
    }
  }

  async getPendingOrders(req, res) {
    try {
      const { page = 1, pageSize = 10, status } = req.query;
      const result = await RepairOrderService.getPendingOrders(
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

  async getCompletedOrders(req, res) {
    try {
      const { page = 1, pageSize = 10 } = req.query;
      const result = await RepairOrderService.getCompletedOrders(
        req.user.id,
        Number(page),
        Number(pageSize)
      );
      res.json({ code: 200, msg: 'success', data: result });
    } catch (error) {
      res.status(400).json({ code: 400, msg: error.message });
    }
  }

  async uploadImage(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ code: 400, msg: '请选择图片' });
      }
      const url = '/uploads/' + req.file.filename;
      res.json({ code: 200, msg: '上传成功', data: { url } });
    } catch (error) {
      res.status(400).json({ code: 400, msg: error.message });
    }
  }
}

module.exports = new RepairOrderController();
