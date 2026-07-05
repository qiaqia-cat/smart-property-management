const Announcement = require('../models/Announcement');
const User = require('../models/User');

class AnnouncementService {
  async createAnnouncement(data) {
    const { title, content, type, publisher_id } = data;

    const announcement = await Announcement.create({
      title,
      content,
      type,
      publisher_id,
    });

    return announcement;
  }

  async getAllAnnouncements(page, pageSize) {
    const { count, rows } = await Announcement.findAndCountAll({
      include: [
        { model: User, as: 'publisher', attributes: ['id', 'name'] },
      ],
      offset: (page - 1) * pageSize,
      limit: pageSize,
      order: [['create_time', 'DESC']],
    });

    return { announcements: rows, total: count };
  }

  async getAnnouncementDetail(announcementId) {
    const announcement = await Announcement.findByPk(announcementId, {
      include: [
        { model: User, as: 'publisher', attributes: ['id', 'name'] },
      ],
    });

    if (!announcement) {
      throw new Error('公告不存在');
    }

    return announcement;
  }

  async updateAnnouncement(announcementId, data) {
    const announcement = await Announcement.findByPk(announcementId);
    if (!announcement) {
      throw new Error('公告不存在');
    }

    const { title, content, type } = data;
    await announcement.update({ title, content, type });
    return announcement;
  }

  async deleteAnnouncement(announcementId) {
    const announcement = await Announcement.findByPk(announcementId);
    if (!announcement) {
      throw new Error('公告不存在');
    }

    await announcement.destroy();
    return { msg: '删除成功' };
  }
}

module.exports = new AnnouncementService();
