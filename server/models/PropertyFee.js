const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const PropertyFee = sequelize.define(
  'PropertyFee',
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
    fee_type: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    billing_cycle: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    pay_time: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    is_remind: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    tableName: 'property_fee',
  }
);

User.hasMany(PropertyFee, { as: 'fees', foreignKey: 'owner_id' });
PropertyFee.belongsTo(User, { as: 'owner', foreignKey: 'owner_id' });

module.exports = PropertyFee;
