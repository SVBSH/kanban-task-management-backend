"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Subtask extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Subtask.belongsTo(models.Task, { foreignKey: "taskId" });
    }
  }
  Subtask.init(
    {
      title: DataTypes.STRING,
      taskId: DataTypes.INTEGER,
      isCompleted: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Subtask",
    }
  );
  return Subtask;
};
