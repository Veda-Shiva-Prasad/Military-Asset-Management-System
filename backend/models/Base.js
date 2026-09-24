const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Base = sequelize.define("Base", {
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
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Base;
