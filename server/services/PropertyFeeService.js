const PropertyFee = require('../models/PropertyFee');
const User = require('../models/User');
const NotificationService = require('./NotificationService');
const sequelize = require('../config/db');

class PropertyFeeService {
  async getOwnerFees(ownerId, page, pageSize, status) {
    const where = { owner_id: ownerId };
    if (status !== undefined) {
      where.status = Number(status);
    }

    const { count, rows } = await PropertyFee.findAndCountAll({
      where,
      offset: (page - 1) * pageSize,
      limit: pageSize,
      order: [['create_time', 'DESC']],
    });

    return { fees: rows, total: count };
  }

  async getAllFees(page, pageSize, status) {
    const where = status !== undefined ? { status: Number(status) } : {};

    const { count, rows } = await PropertyFee.findAndCountAll({
      where,
      include: [
        { model: User, as: 'owner', attributes: ['id', 'name', 'phone', 'building', 'unit', 'room'] },
      ],
      offset: (page - 1) * pageSize,
      limit: pageSize,
      order: [['create_time', 'DESC']],
    });

    return { fees: rows, total: count };
  }

  async payFee(feeId, ownerId) {
    const fee = await PropertyFee.findByPk(feeId);
    if (!fee) {
      throw new Error('账单不存在');
    }

    if (fee.owner_id !== ownerId) {
      throw new Error('该账单不是您的');
    }

    if (fee.status !== 0) {
      throw new Error('该账单已支付');
    }

    await fee.update({ status: 1, pay_time: new Date() });
    return fee;
  }

  async batchCreateFees(data) {
    const { fee_type, amount, billing_cycle } = data;

    const owners = await User.findAll({ where: { role: 0 } });

    if (owners.length === 0) {
      throw new Error('没有业主用户');
    }

    const feeRecords = owners.map((owner) => ({
      owner_id: owner.id,
      fee_type,
      amount,
      billing_cycle,
      status: 0,
      is_remind: 0,
    }));

    await sequelize.transaction(async (t) => {
      await PropertyFee.bulkCreate(feeRecords, { transaction: t });
    });

    return { count: owners.length };
  }

  async remindFee(feeId) {
    const fee = await PropertyFee.findByPk(feeId, {
      include: [{ model: User, as: 'owner', attributes: ['id', 'name'] }],
    });
    if (!fee) {
      throw new Error('账单不存在');
    }

    if (fee.status !== 0) {
      throw new Error('该账单已支付');
    }

    await fee.update({ is_remind: 1 });

    const feeTypeMap = {
      1: '物业费',
      2: '水电费',
      3: '停车费',
      4: '其他费用',
    };
    const feeTypeText = feeTypeMap[fee.fee_type] || '费用';

    await NotificationService.createNotification(
      fee.owner_id,
      '账单催缴通知',
      `您有一笔${feeTypeText}账单（${fee.billing_cycle}）尚未缴纳，金额为¥${Number(fee.amount).toFixed(2)}，请尽快处理。`,
      'fee_remind'
    );

    return fee;
  }
}

module.exports = new PropertyFeeService();
