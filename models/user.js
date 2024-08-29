"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.belongsToMany(models.Board, {
        through: models.BoardUser,
        foreignKey: "userId",
        otherKey: "boardId",
      });
    }
  }
  User.init(
    {
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      createdAt: DataTypes.DATE, // Uistite sa, že máte rovnaké názvy ako v databáze
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
