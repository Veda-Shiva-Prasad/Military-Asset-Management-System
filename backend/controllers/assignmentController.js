const { Assignment, Base, EquipmentType } = require("../models");

const createAuditLog = require("../utils/auditLogger");

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

    const base = await Base.findByPk(baseId);
    const equipment = await EquipmentType.findByPk(equipmentTypeId);

    if (!base || !equipment) {
      return res.status(404).json({
        message: "Base or equipment type not found",
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
    const assignments = await Assignment.findAll({
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
