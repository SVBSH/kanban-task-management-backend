"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TaskGroup extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      TaskGroup.belongsTo(models.Board, { foreignKey: "boardId" });
      TaskGroup.hasMany(models.Task, { foreignKey: "taskGroupId" });
    }
  }
  TaskGroup.init(
    {
      name: DataTypes.STRING,
      boardId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "TaskGroup",
    }
  );
  return TaskGroup;
};
