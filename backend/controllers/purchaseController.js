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
    const purchases = await Purchase.findAll({
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
