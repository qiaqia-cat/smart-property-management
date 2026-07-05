require('dotenv').config();
const bcrypt = require('bcryptjs');
const sequelize = require('../config/db');

const User = require('../models/User');
const RepairOrder = require('../models/RepairOrder');
const Complaint = require('../models/Complaint');
const PropertyFee = require('../models/PropertyFee');
const Visitor = require('../models/Visitor');
const Parking = require('../models/Parking');
const Announcement = require('../models/Announcement');

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('数据库连接成功');

    await sequelize.sync({ force: true });
    console.log('数据库表已重建');

    const hashedPassword = await bcrypt.hash('123456', 10);

    const admin = await User.create({
      username: 'admin',
      password: hashedPassword,
      name: '管理员',
      phone: '13800138000',
      role: 1,
    });
    console.log('管理员用户已创建');

    const owners = [];
    for (let i = 1; i <= 5; i++) {
      const owner = await User.create({
        username: `owner${i}`,
        password: hashedPassword,
        name: `业主${i}`,
        phone: `1380013800${i}`,
        role: 0,
        building: `1${i}栋`,
        unit: `${i}单元`,
        room: `${i}0${i}室`,
      });
      owners.push(owner);
    }
    console.log('业主用户已创建');

    const workers = [];
    const skills = ['水电维修', '管道疏通', '家电维修', '门窗维修', '空调维修'];
    for (let i = 1; i <= 3; i++) {
      const worker = await User.create({
        username: `worker${i}`,
        password: hashedPassword,
        name: `维修工人${i}`,
        phone: `1390013900${i}`,
        role: 2,
        skill: skills[i - 1],
        completed_orders: i * 5,
        avg_rating: 8 + Math.random() * 2,
      });
      workers.push(worker);
    }
    console.log('维修工人已创建');

    const orderTypes = ['水电维修', '管道疏通', '家电维修', '门窗维修', '其他'];
    for (let i = 0; i < 10; i++) {
      const status = i % 4;
      const owner = owners[i % owners.length];
      const worker = status > 0 ? workers[i % workers.length] : null;

      await RepairOrder.create({
        owner_id: owner.id,
        worker_id: worker ? worker.id : null,
        type: orderTypes[i % orderTypes.length],
        title: `报修工单${i + 1}`,
        description: `这是第${i + 1}个报修工单的详细描述，需要进行${orderTypes[i % orderTypes.length]}服务。`,
        location: `${owner.building}${owner.unit}${owner.room}`,
        status,
        repair_result: status === 3 ? '维修完成，问题已解决' : null,
        rating: status === 3 ? Math.floor(Math.random() * 5) + 6 : null,
        feedback: status === 3 ? '服务态度好，维修质量高' : null,
        finish_time: status === 3 ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) : null,
      });
    }
    console.log('报修工单已创建');

    const complaintTypes = ['投诉', '建议'];
    for (let i = 0; i < 5; i++) {
      const status = i % 2;
      const owner = owners[i % owners.length];

      await Complaint.create({
        owner_id: owner.id,
        type: complaintTypes[i % complaintTypes.length],
        title: `投诉建议${i + 1}`,
        content: `这是第${i + 1}个投诉建议的详细内容。`,
        status,
        handle_result: status === 1 ? '已处理，问题已解决' : null,
        handle_time: status === 1 ? new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000) : null,
        handle_admin_id: status === 1 ? admin.id : null,
      });
    }
    console.log('投诉建议已创建');

    for (let i = 0; i < owners.length; i++) {
      const owner = owners[i];
      await PropertyFee.create({
        owner_id: owner.id,
        fee_type: '物业管理费',
        amount: 200 + Math.floor(Math.random() * 100),
        billing_cycle: '2024-01',
        status: i % 2,
        pay_time: i % 2 === 1 ? new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000) : null,
        is_remind: i % 2 === 0 ? Math.floor(Math.random() * 2) : 0,
      });
    }
    console.log('费用账单已创建');

    for (let i = 0; i < 8; i++) {
      const owner = owners[i % owners.length];
      await Visitor.create({
        owner_id: owner.id,
        visitor_name: `访客${i + 1}`,
        visitor_phone: `1370013700${i}`,
        visit_time: new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000),
        pass_code: Math.random().toString(36).substring(2, 8).toUpperCase(),
        status: Math.floor(Math.random() * 2),
      });
    }
    console.log('访客记录已创建');

    const carNumbers = ['京A12345', '京B23456', '京C34567', '京D45678', '京E56789'];
    for (let i = 0; i < 5; i++) {
      const status = i % 2;
      await Parking.create({
        car_number: carNumbers[i],
        parking_space: `A${i + 1}`,
        entry_time: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000),
        exit_time: status === 1 ? new Date(Date.now() - Math.random() * 2 * 24 * 60 * 60 * 1000) : null,
        status,
      });
    }
    console.log('停车记录已创建');

    const announcementTypes = ['通知', '公告'];
    for (let i = 0; i < 5; i++) {
      await Announcement.create({
        title: `系统公告${i + 1}`,
        content: `这是第${i + 1}个系统公告的详细内容，请注意查看。\n\n公告内容可以包含多行文本。`,
        type: announcementTypes[i % announcementTypes.length],
        publisher_id: admin.id,
      });
    }
    console.log('公告已创建');

    console.log('\n测试数据初始化完成！');
    console.log('测试账号：');
    console.log('管理员：admin / 123456');
    console.log('业主：owner1 / 123456');
    console.log('工人：worker1 / 123456');

    process.exit(0);
  } catch (error) {
    console.error('数据初始化失败:', error.message);
    process.exit(1);
  }
}

seed();
