const express = require("express");

const {
  createTransfer,
  getTransfers,
} = require("../controllers/transferController");

const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/rbacMiddleware");

const router = express.Router();

// Create transfer
router.post(
  "/",
  authenticate,
  authorize("ADMIN", "LOGISTICS_OFFICER"),
  createTransfer,
);

// Transfer history
router.get(
  "/",
  authenticate,
  authorize("ADMIN", "BASE_COMMANDER", "LOGISTICS_OFFICER"),
  getTransfers,
);

module.exports = router;
