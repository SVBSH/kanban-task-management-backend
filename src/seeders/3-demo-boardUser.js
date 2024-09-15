"use strict";

const { User, Board } = require("../models");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Fetch users by username
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

    if (!user_demo_1 || !user_demo_2) {
      throw new Error("One or both users not found");
    }

    // Fetch boards
    const boards = await Board.findAll({ attributes: ["id", "name"] });

    // Map boards to easily access their IDs
    const boardMap = boards.reduce((acc, board) => {
      acc[board.name] = board.id;
      return acc;
    }, {});

    // Insert relationships into BoardUser
    await queryInterface.bulkInsert("BoardUsers", [
      {
        boardId: boardMap["Platform Launch"],
        userId: user_demo_1.id, // svato
        role: "Admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        boardId: boardMap["Marketing Plan"],
        userId: user_demo_2.id, // zia
        role: "Editor",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        boardId: boardMap["Roadmap"],
        userId: user_demo_1.id, // svato
        role: "Viewer",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    // Remove all records or specific ones if needed
    await queryInterface.bulkDelete("BoardUsers", null, {});
  },
};
