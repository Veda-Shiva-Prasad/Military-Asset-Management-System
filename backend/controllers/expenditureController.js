const { Expenditure, Base, EquipmentType } = require("../models");

const createAuditLog = require("../utils/auditLogger");

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

    const base = await Base.findByPk(baseId);
    const equipment = await EquipmentType.findByPk(equipmentTypeId);

    if (!base || !equipment) {
      return res.status(404).json({
        message: "Base or equipment type not found",
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
    const expenditures = await Expenditure.findAll({
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
