"use strict";

const { hashPassword } = require("../modules/auth/auth");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("Users", [
      {
        username: "svato",
        createdAt: new Date("2024-08-09 13:26:50.052687"),
        updatedAt: new Date("2024-08-09 13:26:50.052687"),
        password: await hashPassword("svato"),
      },
      {
        username: "zia",
        createdAt: new Date("2024-08-09 13:27:02.57673"),
        updatedAt: new Date("2024-08-09 13:27:02.57673"),
        password: await hashPassword("zia"),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Users", {
      username: ["svato", "zia"],
    });
  },
};
