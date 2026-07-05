require('dotenv').config();
require('express-async-errors');
const express = require('express');
const path = require('path');
const cors = require('cors');
const sequelize = require('./config/db');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const repairOrderRoutes = require('./routes/repairOrder');
const complaintRoutes = require('./routes/complaint');
const propertyFeeRoutes = require('./routes/propertyFee');
const visitorRoutes = require('./routes/visitor');
const parkingRoutes = require('./routes/parking');
const announcementRoutes = require('./routes/announcement');
const dashboardRoutes = require('./routes/dashboard');
const notificationRoutes = require('./routes/notification');
const errorHandler = require('./middleware/error');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/repair-orders', repairOrderRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/property-fees', propertyFeeRoutes);
app.use('/api/visitors', visitorRoutes);
app.use('/api/parkings', parkingRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/notifications', notificationRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await sequelize.authenticate();
    console.log('数据库连接成功');

    await sequelize.sync({ force: false });
    console.log('数据库同步完成');

    app.listen(PORT, () => {
      console.log(`服务器运行在 http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('启动失败:', error.message);
    process.exit(1);
  }
}

start();
