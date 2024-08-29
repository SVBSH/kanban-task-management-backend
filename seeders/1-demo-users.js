"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("Users", [
      {
        username: "svato",
        createdAt: new Date("2024-08-09 13:26:50.052687"),
        updatedAt: new Date("2024-08-09 13:26:50.052687"), // Adding updatedAt
        password: "svato", // Storing passwords in plain text is insecure, use hashing in a real application
      },
      {
        username: "zia",
        createdAt: new Date("2024-08-09 13:27:02.57673"),
        updatedAt: new Date("2024-08-09 13:27:02.57673"), // Adding updatedAt
        password: "zia", // Storing passwords in plain text is insecure, use hashing in a real application
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Users", {
      username: ["svato", "zia"],
    });
  },
};
