const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const EquipmentType = sequelize.define("EquipmentType", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.TEXT,
  },
});

module.exports = EquipmentType;
