const Parking = require('../models/Parking');

class ParkingService {
  async createParking(data) {
    const { car_number, parking_space } = data;

    const parking = await Parking.create({
      car_number,
      parking_space,
      entry_time: new Date(),
      status: 0,
    });

    return parking;
  }

  async getAllParkings(page, pageSize, status) {
    const where = status !== undefined ? { status: Number(status) } : {};

    const { count, rows } = await Parking.findAndCountAll({
      where,
      offset: (page - 1) * pageSize,
      limit: pageSize,
      order: [['entry_time', 'DESC']],
    });

    return { parkings: rows, total: count };
  }

  async exitParking(parkingId) {
    const parking = await Parking.findByPk(parkingId);
    if (!parking) {
      throw new Error('停车记录不存在');
    }

    if (parking.status !== 0) {
      throw new Error('车辆已离场');
    }

    await parking.update({ status: 1, exit_time: new Date() });
    return parking;
  }

  async getParkingDetail(parkingId) {
    const parking = await Parking.findByPk(parkingId);
    if (!parking) {
      throw new Error('停车记录不存在');
    }
    return parking;
  }

  async updateParking(parkingId, data) {
    const parking = await Parking.findByPk(parkingId);
    if (!parking) {
      throw new Error('停车记录不存在');
    }

    const { car_number, parking_space, entry_time, exit_time, status } = data;
    const updateData = {};
    if (car_number !== undefined) updateData.car_number = car_number;
    if (parking_space !== undefined) updateData.parking_space = parking_space;
    if (entry_time !== undefined) updateData.entry_time = entry_time;
    if (exit_time !== undefined) updateData.exit_time = exit_time;
    if (status !== undefined) updateData.status = status;

    await parking.update(updateData);
    return parking;
  }

  async deleteParking(parkingId) {
    const parking = await Parking.findByPk(parkingId);
    if (!parking) {
      throw new Error('停车记录不存在');
    }

    await parking.destroy();
    return { id: parkingId };
  }
}

module.exports = new ParkingService();
