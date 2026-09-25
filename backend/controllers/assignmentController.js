const { Assignment, Base, EquipmentType } = require("../models");
const createAuditLog = require("../utils/auditLogger");
const { getAvailableStock } = require("../utils/inventory");

const createAssignment = async (req, res) => {
  try {
    const { baseId, equipmentTypeId, personnelName, quantity } = req.body;

    if (!baseId || !equipmentTypeId || !personnelName || !quantity) {
      return res.status(400).json({
        message:
          "baseId, equipmentTypeId, personnelName and quantity are required",
      });
    }

    if (quantity <= 0) {
      return res.status(400).json({
        message: "Quantity must be greater than 0",
      });
    }

    // Base Commanders can assign assets only from their assigned base.
    if (
      req.user.role === "BASE_COMMANDER" &&
      Number(baseId) !== Number(req.user.baseId)
    ) {
      return res.status(403).json({
        message: "You can assign assets only from your assigned base",
      });
    }

    const base = await Base.findByPk(baseId);
    const equipment = await EquipmentType.findByPk(equipmentTypeId);

    if (!base || !equipment) {
      return res.status(404).json({
        message: "Base or equipment type not found",
      });
    }

    // Check available inventory before assignment.
    const availableStock = await getAvailableStock(baseId, equipmentTypeId);

    if (quantity > availableStock) {
      return res.status(400).json({
        message: `Insufficient stock. Available quantity: ${availableStock}`,
      });
    }

    const assignment = await Assignment.create({
      baseId,
      equipmentTypeId,
      personnelName,
      quantity,
    });

    await createAuditLog({
      userId: req.user.id,
      action: "CREATE",
      entity: "ASSIGNMENT",
      entityId: assignment.id,
      details: `Assigned ${quantity} units of ${equipment.name} to ${personnelName} at ${base.name}`,
    });

    res.status(201).json({
      message: "Assignment recorded successfully",
      assignment,
    });
  } catch (error) {
    console.error("Create assignment error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const getAssignments = async (req, res) => {
  try {
    const where = {};

    // Base Commanders and Logistics Officers can view
    // assignments only for their assigned base.
    if (
      req.user.role === "BASE_COMMANDER" ||
      req.user.role === "LOGISTICS_OFFICER"
    ) {
      where.baseId = req.user.baseId;
    }

    const assignments = await Assignment.findAll({
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

      order: [["assignmentDate", "DESC"]],
    });

    res.json(assignments);
  } catch (error) {
    console.error("Get assignments error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  createAssignment,
  getAssignments,
};
