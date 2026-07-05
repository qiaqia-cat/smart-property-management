const Complaint = require('../models/Complaint');
const User = require('../models/User');

class ComplaintService {
  async createComplaint(data) {
    const { owner_id, type, title, content } = data;

    const complaint = await Complaint.create({
      owner_id,
      type,
      title,
      content,
      status: 0,
    });

    return complaint;
  }

  async getOwnerComplaints(ownerId, page, pageSize) {
    const { count, rows } = await Complaint.findAndCountAll({
      where: { owner_id: ownerId },
      include: [
        { model: User, as: 'handler', attributes: ['id', 'name'] },
      ],
      offset: (page - 1) * pageSize,
      limit: pageSize,
      order: [['create_time', 'DESC']],
    });

    return { complaints: rows, total: count };
  }

  async getAllComplaints(page, pageSize, status) {
    const where = {};
    if (status !== undefined && status !== '') {
      where.status = Number(status);
    }

    const { count, rows } = await Complaint.findAndCountAll({
      where,
      include: [
        { model: User, as: 'owner', attributes: ['id', 'name', 'phone', 'building', 'unit', 'room'] },
        { model: User, as: 'handler', attributes: ['id', 'name'] },
      ],
      offset: (page - 1) * pageSize,
      limit: pageSize,
      order: [['create_time', 'DESC']],
    });

    return { complaints: rows, total: count };
  }

  async getComplaintDetail(complaintId) {
    const complaint = await Complaint.findByPk(complaintId, {
      include: [
        { model: User, as: 'owner', attributes: ['id', 'name', 'phone', 'building', 'unit', 'room'] },
        { model: User, as: 'handler', attributes: ['id', 'name'] },
      ],
    });

    if (!complaint) {
      throw new Error('投诉不存在');
    }

    return complaint;
  }

  async handleComplaint(complaintId, adminId, data) {
    const { handle_result } = data;

    const complaint = await Complaint.findByPk(complaintId);
    if (!complaint) {
      throw new Error('投诉不存在');
    }

    if (complaint.status !== 0) {
      throw new Error('该投诉已处理');
    }

    await complaint.update({
      status: 1,
      handle_result,
      handle_time: new Date(),
      handle_admin_id: adminId,
    });

    return complaint;
  }

  async deleteComplaint(complaintId) {
    const complaint = await Complaint.findByPk(complaintId);
    if (!complaint) {
      throw new Error('投诉不存在');
    }
    if (complaint.status !== 1) {
      throw new Error('只有已处理的投诉才可以删除');
    }
    await complaint.destroy();
    return complaint;
  }
}

module.exports = new ComplaintService();
