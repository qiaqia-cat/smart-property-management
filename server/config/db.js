const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    timezone: '+08:00',
    define: {
      timestamps: true,
      createdAt: 'create_time',
      updatedAt: 'update_time',
      underscored: true,
    },
    logging: false,
  }
);

module.exports = sequelize;
