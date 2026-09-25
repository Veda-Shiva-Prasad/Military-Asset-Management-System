const { Purchase, Base, EquipmentType } = require("../models");
const createAuditLog = require("../utils/auditLogger");

const createPurchase = async (req, res) => {
  try {
    const { baseId, equipmentTypeId, quantity, purchaseDate, description } =
      req.body;

    if (!baseId || !equipmentTypeId || !quantity || !purchaseDate) {
      return res.status(400).json({
        message:
          "baseId, equipmentTypeId, quantity and purchaseDate are required",
      });
    }

    if (quantity <= 0) {
      return res.status(400).json({
        message: "Quantity must be greater than 0",
      });
    }

    // Base Commanders can record purchases only for their assigned base.
    if (
      req.user.role === "BASE_COMMANDER" &&
      Number(baseId) !== Number(req.user.baseId)
    ) {
      return res.status(403).json({
        message: "You can record purchases only for your assigned base",
      });
    }

    // Logistics Officers can record purchases only for their assigned base.
    if (
      req.user.role === "LOGISTICS_OFFICER" &&
      Number(baseId) !== Number(req.user.baseId)
    ) {
      return res.status(403).json({
        message: "You can record purchases only for your assigned base",
      });
    }

    const base = await Base.findByPk(baseId);
    const equipment = await EquipmentType.findByPk(equipmentTypeId);

    if (!base || !equipment) {
      return res.status(404).json({
        message: "Base or equipment type not found",
      });
    }

    const purchase = await Purchase.create({
      baseId,
      equipmentTypeId,
      quantity,
      purchaseDate,
      description,
    });

    await createAuditLog({
      userId: req.user.id,
      action: "CREATE",
      entity: "PURCHASE",
      entityId: purchase.id,
      details: `Purchased ${quantity} units of ${equipment.name} for ${base.name}`,
    });

    res.status(201).json({
      message: "Purchase recorded successfully",
      purchase,
    });
  } catch (error) {
    console.error("Create purchase error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const getPurchases = async (req, res) => {
  try {
    const where = {};

    // Base Commanders and Logistics Officers can view
    // purchases only for their assigned base.
    if (
      req.user.role === "BASE_COMMANDER" ||
      req.user.role === "LOGISTICS_OFFICER"
    ) {
      where.baseId = req.user.baseId;
    }

    const purchases = await Purchase.findAll({
      where,

      include: [
        {
          model: Base,
          attributes: ["id", "name", "location"],
        },
        {
          model: EquipmentType,
          attributes: ["id", "name"],
        },
      ],

      order: [["purchaseDate", "DESC"]],
    });

    res.json(purchases);
  } catch (error) {
    console.error("Get purchases error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  createPurchase,
  getPurchases,
};
