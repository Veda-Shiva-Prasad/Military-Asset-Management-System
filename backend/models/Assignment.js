const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Assignment = sequelize.define("Assignment", {
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
  personnelName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  assignmentDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = Assignment;
