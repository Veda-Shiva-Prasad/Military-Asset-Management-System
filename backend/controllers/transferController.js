const { Transfer, Base, EquipmentType } = require("../models");

const createAuditLog = require("../utils/auditLogger");

const createTransfer = async (req, res) => {
  try {
    const { fromBaseId, toBaseId, equipmentTypeId, quantity, description } =
      req.body;

    if (!fromBaseId || !toBaseId || !equipmentTypeId || !quantity) {
      return res.status(400).json({
        message:
          "fromBaseId, toBaseId, equipmentTypeId and quantity are required",
      });
    }

    if (fromBaseId === toBaseId) {
      return res.status(400).json({
        message: "Source and destination bases must be different",
      });
    }

    if (quantity <= 0) {
      return res.status(400).json({
        message: "Quantity must be greater than 0",
      });
    }

    const fromBase = await Base.findByPk(fromBaseId);
    const toBase = await Base.findByPk(toBaseId);
    const equipment = await EquipmentType.findByPk(equipmentTypeId);

    if (!fromBase || !toBase || !equipment) {
      return res.status(404).json({
        message: "Base or equipment type not found",
      });
    }

    const transfer = await Transfer.create({
      fromBaseId,
      toBaseId,
      equipmentTypeId,
      quantity,
      description,
    });

    await createAuditLog({
      userId: req.user.id,
      action: "CREATE",
      entity: "TRANSFER",
      entityId: transfer.id,
      details: `Transferred ${quantity} units of ${equipment.name} from ${fromBase.name} to ${toBase.name}`,
    });

    res.status(201).json({
      message: "Transfer recorded successfully",
      transfer,
    });
  } catch (error) {
    console.error("Create transfer error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const getTransfers = async (req, res) => {
  try {
    const transfers = await Transfer.findAll({
      include: [
        {
          model: Base,
          as: "FromBase",
          attributes: ["id", "name", "location"],
        },
        {
          model: Base,
          as: "ToBase",
          attributes: ["id", "name", "location"],
        },
        {
          model: EquipmentType,
          attributes: ["id", "name"],
        },
      ],
      order: [["transferDate", "DESC"]],
    });

    res.json(transfers);
  } catch (error) {
    console.error("Get transfers error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  createTransfer,
  getTransfers,
};
