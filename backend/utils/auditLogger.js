const { AuditLog } = require("../models");

const createAuditLog = async ({
  userId,
  action,
  entity,
  entityId = null,
  details = null,
}) => {
  try {
    await AuditLog.create({
      userId,
      action,
      entity,
      entityId,
      details,
    });
  } catch (error) {
    console.error("Audit log error:", error.message);
  }
};

module.exports = createAuditLog;
