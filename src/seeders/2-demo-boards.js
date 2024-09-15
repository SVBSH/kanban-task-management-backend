"use strict";
const { User } = require("../models");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const user_demo_1 = await User.findOne({
      attributes: ["id", "username"],
      where: {
        username: "svato",
      },
    });

    const user_demo_2 = await User.findOne({
      attributes: ["id", "username"],
      where: {
        username: "zia",
      },
    });
    await queryInterface.bulkInsert("Boards", [
      {
        name: "Platform Launch",
        createdAt: new Date("2024-08-09 11:03:03.038361"),
        updatedAt: new Date("2024-08-09 11:03:03.038361"),
        ownerId: user_demo_1.id,
      },
      {
        name: "Marketing Plan",
        createdAt: new Date("2024-08-09 11:03:03.038361"),
        updatedAt: new Date("2024-08-09 11:03:03.038361"),
        ownerId: user_demo_2.id,
      },
      {
        name: "Roadmap",
        createdAt: new Date("2024-08-09 11:03:03.038361"),
        updatedAt: new Date("2024-08-09 11:03:03.038361"),
        ownerId: user_demo_1.id,
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Boards", null, {});
  },
};

// npx sequelize-cli db:drop
// npx sequelize-cli db:create
// npx sequelize-cli db:migrate

// npx sequelize-cli db:seed:all
// npx sequelize-cli db:seed --seed 1-demo-users.js
