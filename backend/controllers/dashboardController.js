const {
  Purchase,
  Transfer,
  Assignment,
  Expenditure,
  Base,
  EquipmentType,
} = require("../models");

const getDashboard = async (req, res) => {
  try {
    const { baseId, equipmentTypeId, startDate, endDate } = req.query;

    const purchaseWhere = {};
    const transferWhere = {};
    const assignmentWhere = {};
    const expenditureWhere = {};

    if (baseId) {
      purchaseWhere.baseId = baseId;
      assignmentWhere.baseId = baseId;
      expenditureWhere.baseId = baseId;
    }

    if (equipmentTypeId) {
      purchaseWhere.equipmentTypeId = equipmentTypeId;
      transferWhere.equipmentTypeId = equipmentTypeId;
      assignmentWhere.equipmentTypeId = equipmentTypeId;
      expenditureWhere.equipmentTypeId = equipmentTypeId;
    }

    if (startDate && endDate) {
      purchaseWhere.purchaseDate = {
        [require("sequelize").Op.between]: [startDate, endDate],
      };

      transferWhere.transferDate = {
        [require("sequelize").Op.between]: [
          `${startDate} 00:00:00`,
          `${endDate} 23:59:59`,
        ],
      };

      assignmentWhere.assignmentDate = {
        [require("sequelize").Op.between]: [
          `${startDate} 00:00:00`,
          `${endDate} 23:59:59`,
        ],
      };

      expenditureWhere.expenditureDate = {
        [require("sequelize").Op.between]: [
          `${startDate} 00:00:00`,
          `${endDate} 23:59:59`,
        ],
      };
    }

    const purchases = await Purchase.findAll({
      where: purchaseWhere,
    });

    const transfers = await Transfer.findAll({
      where: transferWhere,
    });

    const assignments = await Assignment.findAll({
      where: assignmentWhere,
    });

    const expenditures = await Expenditure.findAll({
      where: expenditureWhere,
    });

    let totalPurchases = 0;
    let transferIn = 0;
    let transferOut = 0;
    let totalAssigned = 0;
    let totalExpended = 0;

    purchases.forEach((item) => {
      totalPurchases += item.quantity;
    });

    transfers.forEach((item) => {
      if (baseId && Number(item.toBaseId) === Number(baseId)) {
        transferIn += item.quantity;
      }

      if (baseId && Number(item.fromBaseId) === Number(baseId)) {
        transferOut += item.quantity;
      }

      if (!baseId) {
        transferIn += item.quantity;
      }
    });

    assignments.forEach((item) => {
      totalAssigned += item.quantity;
    });

    expenditures.forEach((item) => {
      totalExpended += item.quantity;
    });

    const netMovement = totalPurchases + transferIn - transferOut;

    const closingBalance = netMovement - totalAssigned - totalExpended;

    res.json({
      openingBalance: 0,
      purchases: totalPurchases,
      transferIn,
      transferOut,
      netMovement,
      assigned: totalAssigned,
      expended: totalExpended,
      closingBalance,
    });
  } catch (error) {
    console.error("Dashboard error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  getDashboard,
};
ch