const { Expenditure, Base, EquipmentType } = require("../models");
const createAuditLog = require("../utils/auditLogger");
const { getAvailableStock } = require("../utils/inventory");

const createExpenditure = async (req, res) => {
  try {
    const { baseId, equipmentTypeId, quantity, expenditureDate, description } =
      req.body;

    if (!baseId || !equipmentTypeId || !quantity || !expenditureDate) {
      return res.status(400).json({
        message:
          "baseId, equipmentTypeId, quantity and expenditureDate are required",
      });
    }

    if (quantity <= 0) {
      return res.status(400).json({
        message: "Quantity must be greater than 0",
      });
    }

    // Base Commanders can record expenditures only for their assigned base.
    if (
      req.user.role === "BASE_COMMANDER" &&
      Number(baseId) !== Number(req.user.baseId)
    ) {
      return res.status(403).json({
        message: "You can record expenditures only for your assigned base",
      });
    }

    const base = await Base.findByPk(baseId);
    const equipment = await EquipmentType.findByPk(equipmentTypeId);

    if (!base || !equipment) {
      return res.status(404).json({
        message: "Base or equipment type not found",
      });
    }

    // Check available inventory before expenditure.
    const availableStock = await getAvailableStock(baseId, equipmentTypeId);

    if (quantity > availableStock) {
      return res.status(400).json({
        message: `Insufficient stock. Available quantity: ${availableStock}`,
      });
    }

    const expenditure = await Expenditure.create({
      baseId,
      equipmentTypeId,
      quantity,
      expenditureDate,
      description,
    });

    await createAuditLog({
      userId: req.user.id,
      action: "CREATE",
      entity: "EXPENDITURE",
      entityId: expenditure.id,
      details: `Expended ${quantity} units of ${equipment.name} at ${base.name}`,
    });

    res.status(201).json({
      message: "Expenditure recorded successfully",
      expenditure,
    });
  } catch (error) {
    console.error("Create expenditure error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const getExpenditures = async (req, res) => {
  try {
    const where = {};

    // Base Commanders and Logistics Officers can view
    // expenditures only for their assigned base.
    if (
      req.user.role === "BASE_COMMANDER" ||
      req.user.role === "LOGISTICS_OFFICER"
    ) {
      where.baseId = req.user.baseId;
    }

    const expenditures = await Expenditure.findAll({
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

      order: [["expenditureDate", "DESC"]],
    });

    res.json(expenditures);
  } catch (error) {
    console.error("Get expenditures error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  createExpenditure,
  getExpenditures,
};
