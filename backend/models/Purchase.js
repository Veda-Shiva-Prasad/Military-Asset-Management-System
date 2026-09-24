const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Purchase = sequelize.define("Purchase", {
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
  purchaseDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
});

module.exports = Purchase;
