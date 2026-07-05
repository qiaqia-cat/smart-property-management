const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const Complaint = sequelize.define(
  'Complaint',
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
    type: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    handle_result: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    handle_time: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    handle_admin_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: User,
        key: 'id',
      },
    },
  },
  {
    tableName: 'complaint',
  }
);

User.hasMany(Complaint, { as: 'complaints', foreignKey: 'owner_id' });
Complaint.belongsTo(User, { as: 'owner', foreignKey: 'owner_id' });
Complaint.belongsTo(User, { as: 'handler', foreignKey: 'handle_admin_id' });

module.exports = Complaint;
