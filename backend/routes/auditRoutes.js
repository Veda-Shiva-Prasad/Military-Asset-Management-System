const express = require("express");
const { getAuditLogs } = require("../controllers/auditController");
const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/rbacMiddleware");

const router = express.Router();

router.get("/", authenticate, authorize("ADMIN"), getAuditLogs);

module.exports = router;
