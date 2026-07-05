const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const Announcement = sequelize.define(
  'Announcement',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    publisher_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
  },
  {
    tableName: 'announcement',
  }
);

User.hasMany(Announcement, { as: 'announcements', foreignKey: 'publisher_id' });
Announcement.belongsTo(User, { as: 'publisher', foreignKey: 'publisher_id' });

module.exports = Announcement;
