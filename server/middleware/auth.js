const jwt = require('jsonwebtoken');
require('dotenv').config();

const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ code: 401, msg: '未授权，请先登录' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ code: 401, msg: 'token无效或已过期' });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user.role !== 1) {
    return res.status(403).json({ code: 403, msg: '无管理员权限' });
  }
  next();
};

const requireWorker = (req, res, next) => {
  if (req.user.role !== 2) {
    return res.status(403).json({ code: 403, msg: '无维修工人权限' });
  }
  next();
};

module.exports = { auth, requireAdmin, requireWorker };
