const express = require("express");

const {
  createPurchase,
  getPurchases,
} = require("../controllers/purchaseController");

const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/rbacMiddleware");

const router = express.Router();

// Create purchase
router.post(
  "/",
  authenticate,
  authorize("ADMIN", "LOGISTICS_OFFICER"),
  createPurchase,
);

// Get purchase history
router.get(
  "/",
  authenticate,
  authorize("ADMIN", "BASE_COMMANDER", "LOGISTICS_OFFICER"),
  getPurchases,
);

module.exports = router;
