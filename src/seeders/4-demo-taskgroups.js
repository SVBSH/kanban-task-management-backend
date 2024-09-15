"use strict";
const { User, Board } = require("../models");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const user = await User.findOne({
      attributes: ["id"],
      where: {
        username: "svato",
      },
    });

    const boards = await Board.findAll({
      attributes: ["id"],
      where: {
        name: ["Platform Launch", "Marketing Plan"],
        ownerId: user.id, // Predpokladáme, že ownerId je používané ako referencia na používateľa
      },
    });

    if (boards.length === 0) {
      throw new Error(
        'No boards with name "Platform Launch" found for user "svato".'
      );
    }

    const boardIds = boards.map((board) => board.id);

    if (!user) {
      throw new Error('Demo user "svato" not found.');
    }

    await queryInterface.bulkInsert("TaskGroups", [
      {
        name: "Doing",
        boardId: boardIds[0],
      },
      {
        name: "Done",
        boardId: boardIds[0],
      },
      {
        name: "Todo",
        boardId: boardIds[0],
      },
      {
        name: "Todo",
        boardId: boardIds[1],
      },
      {
        name: "Doing",
        boardId: boardIds[1],
      },
      {
        name: "Done",
        boardId: boardIds[1],
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("TaskGroups", null, {});
  },
};
