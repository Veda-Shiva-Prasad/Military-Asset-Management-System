const { Purchase, Transfer, Assignment, Expenditure } = require("../models");

const { Op } = require("sequelize");

const getDashboard = async (req, res) => {
  try {
    let { baseId, equipmentTypeId, startDate, endDate } = req.query;

    /*
     * Base-level access control
     *
     * Admin:
     * Can view any base.
     *
     * Base Commander / Logistics Officer:
     * Can view only their assigned base.
     */
    if (
      req.user.role === "BASE_COMMANDER" ||
      req.user.role === "LOGISTICS_OFFICER"
    ) {
      baseId = req.user.baseId;
    }

    const purchaseWhere = {};
    const transferWhere = {};
    const assignmentWhere = {};
    const expenditureWhere = {};

    /*
     * Base filters
     */
    if (baseId) {
      purchaseWhere.baseId = baseId;

      assignmentWhere.baseId = baseId;

      expenditureWhere.baseId = baseId;

      transferWhere[Op.or] = [{ fromBaseId: baseId }, { toBaseId: baseId }];
    }

    /*
     * Equipment filter
     */
    if (equipmentTypeId) {
      purchaseWhere.equipmentTypeId = equipmentTypeId;

      transferWhere.equipmentTypeId = equipmentTypeId;

      assignmentWhere.equipmentTypeId = equipmentTypeId;

      expenditureWhere.equipmentTypeId = equipmentTypeId;
    }

    /*
     * Opening balance:
     *
     * If a start date is provided,
     * calculate all transactions BEFORE that date.
     *
     * If no start date is provided,
     * opening balance starts from 0.
     */
    let openingBalance = 0;

    if (startDate) {
      const openingPurchaseWhere = {
        ...purchaseWhere,
        purchaseDate: {
          [Op.lt]: startDate,
        },
      };

      const openingAssignmentWhere = {
        ...assignmentWhere,
        assignmentDate: {
          [Op.lt]: `${startDate} 00:00:00`,
        },
      };

      const openingExpenditureWhere = {
        ...expenditureWhere,
        expenditureDate: {
          [Op.lt]: `${startDate} 00:00:00`,
        },
      };

      const openingTransferWhere = {
        ...transferWhere,
        transferDate: {
          [Op.lt]: `${startDate} 00:00:00`,
        },
      };

      const [
        openingPurchases,
        openingTransfers,
        openingAssignments,
        openingExpenditures,
      ] = await Promise.all([
        Purchase.findAll({
          where: openingPurchaseWhere,
        }),

        Transfer.findAll({
          where: openingTransferWhere,
        }),

        Assignment.findAll({
          where: openingAssignmentWhere,
        }),

        Expenditure.findAll({
          where: openingExpenditureWhere,
        }),
      ]);

      let openingPurchasesTotal = 0;
      let openingTransferIn = 0;
      let openingTransferOut = 0;
      let openingAssigned = 0;
      let openingExpended = 0;

      openingPurchases.forEach((item) => {
        openingPurchasesTotal += item.quantity;
      });

      openingTransfers.forEach((item) => {
        if (baseId && Number(item.toBaseId) === Number(baseId)) {
          openingTransferIn += item.quantity;
        }

        if (baseId && Number(item.fromBaseId) === Number(baseId)) {
          openingTransferOut += item.quantity;
        }
      });

      openingAssignments.forEach((item) => {
        openingAssigned += item.quantity;
      });

      openingExpenditures.forEach((item) => {
        openingExpended += item.quantity;
      });

      openingBalance =
        openingPurchasesTotal +
        openingTransferIn -
        openingTransferOut -
        openingAssigned -
        openingExpended;
    }

    /*
     * Current-period date filters
     */
    if (startDate && endDate) {
      purchaseWhere.purchaseDate = {
        [Op.between]: [startDate, endDate],
      };

      transferWhere.transferDate = {
        [Op.between]: [`${startDate} 00:00:00`, `${endDate} 23:59:59`],
      };

      assignmentWhere.assignmentDate = {
        [Op.between]: [`${startDate} 00:00:00`, `${endDate} 23:59:59`],
      };

      expenditureWhere.expenditureDate = {
        [Op.between]: [`${startDate} 00:00:00`, `${endDate} 23:59:59`],
      };
    } else if (startDate) {
      purchaseWhere.purchaseDate = {
        [Op.gte]: startDate,
      };

      transferWhere.transferDate = {
        [Op.gte]: `${startDate} 00:00:00`,
      };

      assignmentWhere.assignmentDate = {
        [Op.gte]: `${startDate} 00:00:00`,
      };

      expenditureWhere.expenditureDate = {
        [Op.gte]: `${startDate} 00:00:00`,
      };
    } else if (endDate) {
      purchaseWhere.purchaseDate = {
        [Op.lte]: endDate,
      };

      transferWhere.transferDate = {
        [Op.lte]: `${endDate} 23:59:59`,
      };

      assignmentWhere.assignmentDate = {
        [Op.lte]: `${endDate} 23:59:59`,
      };

      expenditureWhere.expenditureDate = {
        [Op.lte]: `${endDate} 23:59:59`,
      };
    }

    /*
     * Get transactions
     */
    const [purchases, transfers, assignments, expenditures] = await Promise.all(
      [
        Purchase.findAll({
          where: purchaseWhere,
        }),

        Transfer.findAll({
          where: transferWhere,
        }),

        Assignment.findAll({
          where: assignmentWhere,
        }),

        Expenditure.findAll({
          where: expenditureWhere,
        }),
      ],
    );

    /*
     * Calculate current-period totals
     */
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
    });

    assignments.forEach((item) => {
      totalAssigned += item.quantity;
    });

    expenditures.forEach((item) => {
      totalExpended += item.quantity;
    });

    /*
     * Dashboard calculations
     */
    const netMovement = totalPurchases + transferIn - transferOut;

    const closingBalance =
      openingBalance + netMovement - totalAssigned - totalExpended;

    res.json({
      openingBalance,
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
