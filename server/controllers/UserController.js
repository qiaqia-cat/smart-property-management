const UserService = require('../services/UserService');

class UserController {
  async register(req, res) {
    try {
      const result = await UserService.register(req.body);
      res.json({ code: 200, msg: '注册成功', data: result });
    } catch (error) {
      res.status(400).json({ code: 400, msg: error.message });
    }
  }

  async login(req, res) {
    try {
      const result = await UserService.login(req.body);
      res.json({ code: 200, msg: '登录成功', data: result });
    } catch (error) {
      res.status(400).json({ code: 400, msg: error.message });
    }
  }

  async getUserInfo(req, res) {
    try {
      const user = await UserService.getUserInfo(req.user.id);
      res.json({ code: 200, msg: 'success', data: user });
    } catch (error) {
      res.status(400).json({ code: 400, msg: error.message });
    }
  }

  async getUsers(req, res) {
    try {
      const { page = 1, pageSize = 10, role } = req.query;
      const result = await UserService.getUsers(Number(page), Number(pageSize), role !== undefined ? Number(role) : undefined);
      res.json({ code: 200, msg: 'success', data: result });
    } catch (error) {
      res.status(400).json({ code: 400, msg: error.message });
    }
  }

  async createUser(req, res) {
    try {
      const user = await UserService.createUser(req.body);
      res.json({ code: 200, msg: '创建成功', data: user });
    } catch (error) {
      res.status(400).json({ code: 400, msg: error.message });
    }
  }

  async deleteUser(req, res) {
    try {
      const result = await UserService.deleteUser(req.params.id);
      res.json({ code: 200, msg: result.msg });
    } catch (error) {
      res.status(400).json({ code: 400, msg: error.message });
    }
  }

  async getWorkers(req, res) {
    try {
      const workers = await UserService.getWorkers();
      res.json({ code: 200, msg: 'success', data: workers });
    } catch (error) {
      res.status(400).json({ code: 400, msg: error.message });
    }
  }
}

module.exports = new UserController();
