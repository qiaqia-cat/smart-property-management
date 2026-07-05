const Visitor = require('../models/Visitor');
const User = require('../models/User');

class VisitorService {
  async createVisitor(data) {
    const { owner_id, visitor_name, visitor_phone, visit_time } = data;

    const passCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    const visitor = await Visitor.create({
      owner_id,
      visitor_name,
      visitor_phone,
      visit_time,
      pass_code: passCode,
      status: 0,
    });

    return visitor;
  }

  async getOwnerVisitors(ownerId, page, pageSize) {
    // 自动将已超时的待到访访客标记为已到访
    await Visitor.update(
      { status: 1 },
      {
        where: {
          owner_id: ownerId,
          status: 0,
          visit_time: { [require('sequelize').Op.lt]: new Date() }
        }
      }
    );

    const { count, rows } = await Visitor.findAndCountAll({
      where: { owner_id: ownerId },
      offset: (page - 1) * pageSize,
      limit: pageSize,
      order: [['id', 'ASC']],
    });

    return { visitors: rows, total: count };
  }

  async updateVisitor(visitorId, ownerId, data) {
    const visitor = await Visitor.findByPk(visitorId);
    if (!visitor) {
      throw new Error('访客记录不存在');
    }
    if (visitor.owner_id !== ownerId) {
      throw new Error('无权操作该访客记录');
    }

    const { visitor_name, visitor_phone, visit_time } = data;
    await visitor.update({ visitor_name, visitor_phone, visit_time });
    return visitor;
  }

  async deleteVisitor(visitorId, ownerId) {
    const visitor = await Visitor.findByPk(visitorId);
    if (!visitor) {
      throw new Error('访客记录不存在');
    }
    if (visitor.owner_id !== ownerId) {
      throw new Error('无权操作该访客记录');
    }

    await visitor.destroy();
    return true;
  }
}

module.exports = new VisitorService();
