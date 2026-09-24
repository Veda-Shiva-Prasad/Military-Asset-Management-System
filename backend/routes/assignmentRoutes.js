const express = require("express");

const {
  createAssignment,
  getAssignments,
} = require("../controllers/assignmentController");

const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/rbacMiddleware");

const router = express.Router();

// Create assignment
router.post(
  "/",
  authenticate,
  authorize("ADMIN", "BASE_COMMANDER"),
  createAssignment,
);

// Assignment history
router.get(
  "/",
  authenticate,
  authorize("ADMIN", "BASE_COMMANDER", "LOGISTICS_OFFICER"),
  getAssignments,
);

module.exports = router;
