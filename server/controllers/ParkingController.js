const ParkingService = require('../services/ParkingService');

class ParkingController {
  async createParking(req, res) {
    try {
      const parking = await ParkingService.createParking(req.body);
      res.json({ code: 200, msg: '入场登记成功', data: parking });
    } catch (error) {
      res.status(400).json({ code: 400, msg: error.message });
    }
  }

  async getAllParkings(req, res) {
    try {
      const { page = 1, pageSize = 10, status } = req.query;
      const result = await ParkingService.getAllParkings(
        Number(page),
        Number(pageSize),
        status
      );
      res.json({ code: 200, msg: 'success', data: result });
    } catch (error) {
      res.status(400).json({ code: 400, msg: error.message });
    }
  }

  async exitParking(req, res) {
    try {
      const parking = await ParkingService.exitParking(req.params.id);
      res.json({ code: 200, msg: '离场成功', data: parking });
    } catch (error) {
      res.status(400).json({ code: 400, msg: error.message });
    }
  }

  async getParkingDetail(req, res) {
    try {
      const parking = await ParkingService.getParkingDetail(req.params.id);
      res.json({ code: 200, msg: 'success', data: parking });
    } catch (error) {
      res.status(400).json({ code: 400, msg: error.message });
    }
  }

  async updateParking(req, res) {
    try {
      const parking = await ParkingService.updateParking(req.params.id, req.body);
      res.json({ code: 200, msg: '更新成功', data: parking });
    } catch (error) {
      res.status(400).json({ code: 400, msg: error.message });
    }
  }

  async deleteParking(req, res) {
    try {
      const result = await ParkingService.deleteParking(req.params.id);
      res.json({ code: 200, msg: '删除成功', data: result });
    } catch (error) {
      res.status(400).json({ code: 400, msg: error.message });
    }
  }
}

module.exports = new ParkingController();
