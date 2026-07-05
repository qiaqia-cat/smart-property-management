const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Parking = sequelize.define(
  'Parking',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    car_number: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    parking_space: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    entry_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    exit_time: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    tableName: 'parking',
  }
);

module.exports = Parking;
