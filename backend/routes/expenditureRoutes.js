const express = require("express");

const {
  createExpenditure,
  getExpenditures,
} = require("../controllers/expenditureController");

const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/rbacMiddleware");

const router = express.Router();

// Create expenditure
router.post(
  "/",
  authenticate,
  authorize("ADMIN", "BASE_COMMANDER"),
  createExpenditure,
);

// Expenditure history
router.get(
  "/",
  authenticate,
  authorize("ADMIN", "BASE_COMMANDER"),
  getExpenditures,
);

module.exports = router;
