"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Task.belongsTo(models.TaskGroup, { foreignKey: "taskGroupId" });
      Task.hasMany(models.Subtask, { foreignKey: "taskId" });
    }
  }
  Task.init(
    {
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
      taskGroupId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Task",
    }
  );
  return Task;
};
