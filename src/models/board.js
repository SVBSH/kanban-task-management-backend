"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Board extends Model {
    static associate(models) {
      // M:N vzťah cez BoardUser pivot tabuľku
      Board.belongsToMany(models.User, {
        through: models.BoardUser,
        foreignKey: "boardId",
        otherKey: "userId",
      });
      // 1:N vzťah s TaskGroup
      Board.hasMany(models.TaskGroup, { foreignKey: "boardId" });
      // 1:1 vzťah s User ako owner
      Board.belongsTo(models.User, { foreignKey: "ownerId", as: "owner" });
    }
  }
  Board.init(
    {
      name: DataTypes.STRING,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE, // Pridajte, ak je to potrebné
      ownerId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Users", // Opravený názov tabuľky
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
    },
    {
      sequelize,
      modelName: "Board",
    }
  );
  return Board;
};
