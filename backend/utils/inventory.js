const { Purchase, Transfer, Assignment, Expenditure } = require("../models");

const getAvailableStock = async (baseId, equipmentTypeId) => {
  const purchases = await Purchase.sum("quantity", {
    where: {
      baseId,
      equipmentTypeId,
    },
  });

  const transfersIn = await Transfer.sum("quantity", {
    where: {
      toBaseId: baseId,
      equipmentTypeId,
    },
  });

  const transfersOut = await Transfer.sum("quantity", {
    where: {
      fromBaseId: baseId,
      equipmentTypeId,
    },
  });

  const assignments = await Assignment.sum("quantity", {
    where: {
      baseId,
      equipmentTypeId,
    },
  });

  const expenditures = await Expenditure.sum("quantity", {
    where: {
      baseId,
      equipmentTypeId,
    },
  });

  return (
    (purchases || 0) +
    (transfersIn || 0) -
    (transfersOut || 0) -
    (assignments || 0) -
    (expenditures || 0)
  );
};

module.exports = {
  getAvailableStock,
};
