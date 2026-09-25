const { AuditLog, User } = require("../models");

const getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.findAll({
      include: [
        {
          model: User,
          attributes: ["id", "name", "email", "role"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(logs);
  } catch (error) {
    console.error("Get audit logs error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  getAuditLogs,
};
