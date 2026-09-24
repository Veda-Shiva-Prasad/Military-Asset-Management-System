const bcrypt = require("bcryptjs");
const { User, Base, EquipmentType } = require("../models");

const seedDatabase = async () => {
  try {
    // Create bases
    const [bangalore, hyderabad, pune] = await Promise.all([
      Base.findOrCreate({
        where: { name: "Bangalore Base" },
        defaults: { location: "Bangalore" },
      }),
      Base.findOrCreate({
        where: { name: "Hyderabad Base" },
        defaults: { location: "Hyderabad" },
      }),
      Base.findOrCreate({
        where: { name: "Pune Base" },
        defaults: { location: "Pune" },
      }),
    ]);

    // Create equipment types
    await EquipmentType.findOrCreate({
      where: { name: "Vehicles" },
      defaults: { description: "Military vehicles" },
    });

    await EquipmentType.findOrCreate({
      where: { name: "Weapons" },
      defaults: { description: "Military weapons" },
    });

    await EquipmentType.findOrCreate({
      where: { name: "Communication Equipment" },
      defaults: { description: "Communication devices" },
    });

    // Password
    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    // Admin
    await User.findOrCreate({
      where: { email: "admin@mams.com" },
      defaults: {
        name: "System Admin",
        password: hashedPassword,
        role: "ADMIN",
        baseId: null,
      },
    });

    // Base Commander
    await User.findOrCreate({
      where: { email: "commander@mams.com" },
      defaults: {
        name: "Bangalore Commander",
        password: hashedPassword,
        role: "BASE_COMMANDER",
        baseId: bangalore[0].id,
      },
    });

    // Logistics Officer
    await User.findOrCreate({
      where: { email: "logistics@mams.com" },
      defaults: {
        name: "Bangalore Logistics Officer",
        password: hashedPassword,
        role: "LOGISTICS_OFFICER",
        baseId: bangalore[0].id,
      },
    });

    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Seeding error:", error);
  }
};

module.exports = seedDatabase;
