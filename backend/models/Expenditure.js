const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Expenditure = sequelize.define("Expenditure", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  baseId: {
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
  expenditureDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  description: {
    type: DataTypes.TEXT,
  },
});

module.exports = Expenditure;
