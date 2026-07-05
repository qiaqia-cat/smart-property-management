const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const Visitor = sequelize.define(
  'Visitor',
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
    visitor_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    visitor_phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    visit_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    pass_code: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    tableName: 'visitor',
  }
);

User.hasMany(Visitor, { as: 'visitors', foreignKey: 'owner_id' });
Visitor.belongsTo(User, { as: 'owner', foreignKey: 'owner_id' });

module.exports = Visitor;
