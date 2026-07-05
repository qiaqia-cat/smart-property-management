const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

class UserService {
  async register(data) {
    const { username, password, name, phone, role, building, unit, room, skill } = data;

    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      throw new Error('用户名已存在');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      password: hashedPassword,
      name,
      phone,
      role: 0, // 公开注册强制为业主角色，管理员/工人需通过管理后台创建
      building,
      unit,
      room,
      skill,
    });

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        phone: user.phone,
        role: user.role,
        building: user.building,
        unit: user.unit,
        room: user.room,
        skill: user.skill,
        completed_orders: user.completed_orders,
        avg_rating: user.avg_rating,
      },
    };
  }

  async login(data) {
    const { username, password } = data;

    const user = await User.findOne({ where: { username } });
    if (!user) {
      throw new Error('用户名或密码错误');
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new Error('用户名或密码错误');
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        phone: user.phone,
        role: user.role,
        building: user.building,
        unit: user.unit,
        room: user.room,
        skill: user.skill,
        completed_orders: user.completed_orders,
        avg_rating: user.avg_rating,
      },
    };
  }

  async getUserInfo(userId) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('用户不存在');
    }

    return {
      id: user.id,
      username: user.username,
      name: user.name,
      phone: user.phone,
      role: user.role,
      building: user.building,
      unit: user.unit,
      room: user.room,
      skill: user.skill,
      completed_orders: user.completed_orders,
      avg_rating: user.avg_rating,
      create_time: user.create_time,
    };
  }

  async getUsers(page, pageSize, role) {
    const where = role !== undefined ? { role } : {};
    const { count, rows } = await User.findAndCountAll({
      where,
      offset: (page - 1) * pageSize,
      limit: pageSize,
      order: [['id', 'ASC']],
    });

    const users = rows.map((user) => ({
      id: user.id,
      username: user.username,
      name: user.name,
      phone: user.phone,
      role: user.role,
      building: user.building,
      unit: user.unit,
      room: user.room,
      skill: user.skill,
      completed_orders: user.completed_orders,
      avg_rating: user.avg_rating,
      create_time: user.create_time,
    }));

    return { users, total: count };
  }

  async createUser(data) {
    const { username, password, name, phone, role, building, unit, room, skill } = data;

    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      throw new Error('用户名已存在');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      password: hashedPassword,
      name,
      phone,
      role: role || 0,
      building,
      unit,
      room,
      skill,
    });

    return {
      id: user.id,
      username: user.username,
      name: user.name,
      phone: user.phone,
      role: user.role,
      building: user.building,
      unit: user.unit,
      room: user.room,
      skill: user.skill,
    };
  }

  async deleteUser(userId) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('用户不存在');
    }

    if (user.role === 1) {
      throw new Error('不能删除管理员');
    }

    await user.destroy();
    return { msg: '删除成功' };
  }

  async getWorkers() {
    const workers = await User.findAll({
      where: { role: 2 },
      order: [['completed_orders', 'DESC']],
    });

    return workers.map((worker) => ({
      id: worker.id,
      name: worker.name,
      skill: worker.skill,
      completed_orders: worker.completed_orders,
      avg_rating: worker.avg_rating,
    }));
  }

  async updateWorkerStats(workerId, rating, transaction = null) {
    const worker = await User.findByPk(workerId);
    if (!worker) {
      throw new Error('工人不存在');
    }

    const newCompletedOrders = worker.completed_orders + 1;
    const newAvgRating =
      worker.completed_orders === 0
        ? rating
        : ((worker.avg_rating * worker.completed_orders + rating) / newCompletedOrders).toFixed(1);

    await worker.update({
      completed_orders: newCompletedOrders,
      avg_rating: parseFloat(newAvgRating),
    }, { transaction });

    return worker;
  }
}

module.exports = new UserService();
