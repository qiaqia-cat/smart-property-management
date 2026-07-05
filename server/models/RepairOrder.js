const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const RepairOrder = sequelize.define(
  'RepairOrder',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    owner_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    worker_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: User,
        key: 'id',
      },
    },
    type: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    repair_result: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    repair_img: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    feedback: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    finish_time: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: 'repair_order',
  }
);

User.hasMany(RepairOrder, { as: 'owner_orders', foreignKey: 'owner_id' });
User.hasMany(RepairOrder, { as: 'worker_orders', foreignKey: 'worker_id' });
RepairOrder.belongsTo(User, { as: 'owner', foreignKey: 'owner_id' });
RepairOrder.belongsTo(User, { as: 'worker', foreignKey: 'worker_id' });

module.exports = RepairOrder;
