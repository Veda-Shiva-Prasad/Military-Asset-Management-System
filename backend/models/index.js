const User = require("./User");
const Base = require("./Base");
const EquipmentType = require("./EquipmentType");
const Purchase = require("./Purchase");
const Transfer = require("./Transfer");
const Assignment = require("./Assignment");
const Expenditure = require("./Expenditure");
const AuditLog = require("./AuditLog");

// User → Base
Base.hasMany(User, { foreignKey: "baseId" });
User.belongsTo(Base, { foreignKey: "baseId" });

// Purchase relationships
Base.hasMany(Purchase, { foreignKey: "baseId" });
Purchase.belongsTo(Base, { foreignKey: "baseId" });

EquipmentType.hasMany(Purchase, { foreignKey: "equipmentTypeId" });
Purchase.belongsTo(EquipmentType, { foreignKey: "equipmentTypeId" });

// Transfer relationships
Base.hasMany(Transfer, { foreignKey: "fromBaseId", as: "OutgoingTransfers" });
Base.hasMany(Transfer, { foreignKey: "toBaseId", as: "IncomingTransfers" });

Transfer.belongsTo(Base, { foreignKey: "fromBaseId", as: "FromBase" });
Transfer.belongsTo(Base, { foreignKey: "toBaseId", as: "ToBase" });

EquipmentType.hasMany(Transfer, { foreignKey: "equipmentTypeId" });
Transfer.belongsTo(EquipmentType, { foreignKey: "equipmentTypeId" });

// Assignment relationships
Base.hasMany(Assignment, { foreignKey: "baseId" });
Assignment.belongsTo(Base, { foreignKey: "baseId" });

EquipmentType.hasMany(Assignment, { foreignKey: "equipmentTypeId" });
Assignment.belongsTo(EquipmentType, { foreignKey: "equipmentTypeId" });

// Expenditure relationships
Base.hasMany(Expenditure, { foreignKey: "baseId" });
Expenditure.belongsTo(Base, { foreignKey: "baseId" });

EquipmentType.hasMany(Expenditure, { foreignKey: "equipmentTypeId" });
Expenditure.belongsTo(EquipmentType, { foreignKey: "equipmentTypeId" });

// Audit Log relationships
User.hasMany(AuditLog, { foreignKey: "userId" });
AuditLog.belongsTo(User, { foreignKey: "userId" });

module.exports = {
  User,
  Base,
  EquipmentType,
  Purchase,
  Transfer,
  Assignment,
  Expenditure,
  AuditLog,
};
