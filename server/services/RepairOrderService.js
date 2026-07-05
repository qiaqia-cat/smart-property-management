const { Op } = require('sequelize');
const RepairOrder = require('../models/RepairOrder');
const User = require('../models/User');
const sequelize = require('../config/db');

class RepairOrderService {
  async createOrder(data) {
    const { owner_id, type, title, description, location } = data;

    const order = await RepairOrder.create({
      owner_id,
      type,
      title,
      description,
      location,
      status: 0,
    });

    return order;
  }

  async getOwnerOrders(ownerId, page, pageSize) {
    const { count, rows } = await RepairOrder.findAndCountAll({
      where: { owner_id: ownerId },
      include: [
        { model: User, as: 'worker', attributes: ['id', 'name', 'phone', 'skill'] },
      ],
      offset: (page - 1) * pageSize,
      limit: pageSize,
      order: [['create_time', 'DESC']],
    });

    return { orders: rows, total: count };
  }

  async getAllOrders(page, pageSize, status) {
    const where = status !== undefined ? { status: Number(status) } : {};

    const { count, rows } = await RepairOrder.findAndCountAll({
      where,
      include: [
        { model: User, as: 'owner', attributes: ['id', 'name', 'phone', 'building', 'unit', 'room'] },
        { model: User, as: 'worker', attributes: ['id', 'name', 'phone', 'skill'] },
      ],
      offset: (page - 1) * pageSize,
      limit: pageSize,
      order: [['id', 'ASC']],
    });

    return { orders: rows, total: count };
  }

  async getWorkerOrders(workerId, page, pageSize) {
    const { count, rows } = await RepairOrder.findAndCountAll({
      where: { worker_id: workerId, status: { [Op.ne]: 4 } },
      include: [
        { model: User, as: 'owner', attributes: ['id', 'name', 'phone', 'building', 'unit', 'room'] },
      ],
      offset: (page - 1) * pageSize,
      limit: pageSize,
      order: [['create_time', 'DESC']],
    });

    return { orders: rows, total: count };
  }

  async getOrderDetail(orderId) {
    const order = await RepairOrder.findByPk(orderId, {
      include: [
        { model: User, as: 'owner', attributes: ['id', 'name', 'phone', 'building', 'unit', 'room'] },
        { model: User, as: 'worker', attributes: ['id', 'name', 'phone', 'skill'] },
      ],
    });

    if (!order) {
      throw new Error('工单不存在');
    }

    return order;
  }

  async assignWorker(orderId, workerId) {
    const order = await RepairOrder.findByPk(orderId);
    if (!order) {
      throw new Error('工单不存在');
    }

    if (order.status !== 0) {
      throw new Error('该工单已被处理');
    }

    await order.update({ worker_id: workerId, status: 1 });
    return order;
  }

  async acceptOrder(orderId, workerId) {
    const order = await RepairOrder.findByPk(orderId);
    if (!order) {
      throw new Error('工单不存在');
    }

    if (order.worker_id !== workerId) {
      throw new Error('该工单未分配给您');
    }

    if (order.status !== 1) {
      throw new Error('工单状态不允许接单');
    }

    await order.update({ status: 2 });
    return order;
  }

  async completeOrder(orderId, workerId, data) {
    const order = await RepairOrder.findByPk(orderId);
    if (!order) {
      throw new Error('工单不存在');
    }

    if (order.worker_id !== workerId) {
      throw new Error('该工单不是您的');
    }

    if (order.status !== 2) {
      throw new Error('工单状态不允许完工');
    }

    await order.update({
      status: 3,
      repair_result: data.repair_result,
      repair_img: data.repair_img,
      finish_time: new Date(),
    });

    return order;
  }

  async rateOrder(orderId, ownerId, data) {
    const { rating, feedback } = data;

    const order = await RepairOrder.findByPk(orderId);
    if (!order) {
      throw new Error('工单不存在');
    }

    if (order.owner_id !== ownerId) {
      throw new Error('该工单不是您的');
    }

    if (order.status !== 3) {
      throw new Error('工单未完成，无法评价');
    }

    if (order.rating !== null) {
      throw new Error('该工单已评价');
    }

    if (rating < 1 || rating > 10) {
      throw new Error('评分必须在1-10之间');
    }

    const UserService = require('./UserService');

    await sequelize.transaction(async (t) => {
      await order.update({ rating, feedback }, { transaction: t });
      await UserService.updateWorkerStats(order.worker_id, rating, t);
    });

    return order;
  }

  async getWorkerStats(workerId) {
    const pendingCount = await RepairOrder.count({ where: { worker_id: workerId, status: 1 } });
    const processingCount = await RepairOrder.count({ where: { worker_id: workerId, status: 2 } });
    const completedCount = await RepairOrder.count({ where: { worker_id: workerId, status: 3 } });
    const totalCount = await RepairOrder.count({ where: { worker_id: workerId } });

    const recentOrders = await RepairOrder.findAll({
      where: { worker_id: workerId },
      include: [
        { model: User, as: 'owner', attributes: ['id', 'name', 'phone', 'building', 'unit', 'room'] },
      ],
      limit: 5,
      order: [['create_time', 'DESC']],
    });

    return {
      pending: pendingCount,
      processing: processingCount,
      completed: completedCount,
      total: totalCount,
      recentOrders,
    };
  }

  async getPendingOrders(workerId, page = 1, pageSize = 10, status) {
    const where = { worker_id: workerId };
    if (status !== undefined && status !== '-1') {
      where.status = Number(status);
    } else {
      where.status = [1, 2]; // pending: status 1(待接单) or 2(处理中)
    }

    const { count, rows } = await RepairOrder.findAndCountAll({
      where,
      include: [
        { model: User, as: 'owner', attributes: ['id', 'name', 'phone', 'building', 'unit', 'room'] },
      ],
      offset: (page - 1) * pageSize,
      limit: pageSize,
      order: [['create_time', 'DESC']],
    });

    return { orders: rows, total: count };
  }

  async getCompletedOrders(workerId, page, pageSize) {
    const { count, rows } = await RepairOrder.findAndCountAll({
      where: { worker_id: workerId, status: 3 },
      include: [
        { model: User, as: 'owner', attributes: ['id', 'name', 'phone', 'building', 'unit', 'room'] },
      ],
      offset: (page - 1) * pageSize,
      limit: pageSize,
      order: [['finish_time', 'DESC']],
    });

    return { orders: rows, total: count };
  }

  async cancelOrder(orderId, ownerId) {
    const order = await RepairOrder.findByPk(orderId);
    if (!order) {
      throw new Error('工单不存在');
    }

    if (order.owner_id !== ownerId) {
      throw new Error('该工单不是您的');
    }

    if (order.status !== 0) {
      throw new Error('该工单已被处理，无法撤销');
    }

    await order.update({ status: 4 });
    return { id: orderId };
  }

  async deleteOrder(orderId) {
    const order = await RepairOrder.findByPk(orderId);
    if (!order) {
      throw new Error('工单不存在');
    }

    await order.destroy();
    return { id: orderId };
  }
}

module.exports = new RepairOrderService();
