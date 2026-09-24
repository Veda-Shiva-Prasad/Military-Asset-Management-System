const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Transfer = sequelize.define("Transfer", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  fromBaseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  toBaseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  equipmentTypeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  transferDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  description: {
    type: DataTypes.TEXT,
  },
});

module.exports = Transfer;
