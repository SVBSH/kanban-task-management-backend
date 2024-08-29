"use strict";
const { TaskGroup } = require("../models");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tg_1 = await TaskGroup.findOne({
      attributes: ["id"],
      where: {
        name: "Todo",
      },
    });
    const tg_2 = await TaskGroup.findOne({
      attributes: ["id"],
      where: {
        name: "Doing",
      },
    });
    const tg_3 = await TaskGroup.findOne({
      attributes: ["id"],
      where: {
        name: "Done",
      },
    });
    await queryInterface.bulkInsert("Tasks", [
      {
        name: "Build UI for onboarding flow",
        description: "some descriptions",
        taskGroupId: tg_1.id,
      },
      {
        name: "Build UI for search",
        description: "asda",
        taskGroupId: tg_1.id,
      },
      {
        name: "Build settings UI",
        description: "mn n",
        taskGroupId: tg_1.id,
      },
      {
        name: "QA and test all major user journeys",
        description:
          "Once we feel version one is ready, we need to rigorously test it both internally and externally to identify any major gaps.",
        taskGroupId: tg_1.id,
      },
      {
        name: "Design settings and search pages",
        description: "asdasdsa",
        taskGroupId: tg_2.id,
      },
      {
        name: "Add account management endpoints",
        description: "adssda",
        taskGroupId: tg_2.id,
      },
      {
        name: "Design onboarding flow",
        description: "mnmn",
        taskGroupId: tg_2.id,
      },
      {
        name: "Add search endpoints",
        description: "aa",
        taskGroupId: tg_2.id,
      },
      {
        name: "Add authentication endpoints",
        description: "aaa",
        taskGroupId: tg_2.id,
      },
      {
        name: "Research pricing points of various competitors and trial different business models",
        description:
          "We know what we're planning to build for version one. Now we need to finalise the first pricing model we'll use. Keep iterating the subtasks until we have a coherent proposition.",
        taskGroupId: tg_2.id,
      },
      {
        name: "Conduct 5 wireframe tests",
        description:
          "Ensure the layout continues to make sense and we have strong buy-in from potential users.",
        taskGroupId: tg_3.id,
      },
      {
        name: "Create wireframe prototype",
        description:
          "Create a greyscale clickable wireframe prototype to test our assumptions so far.",
        taskGroupId: tg_3.id,
      },
      {
        name: "Review results of usability tests and iterate",
        description:
          "Keep iterating through the subtasks until we're clear on the core concepts for the app.",
        taskGroupId: tg_3.id,
      },
      {
        name: "Create paper prototypes and conduct 10 usability tests with potential customers",
        description: "admnmn",
        taskGroupId: tg_3.id,
      },
      {
        name: "Market discovery",
        description:
          "We need to define and refine our core product. Interviews will help us learn common pain points and help us define the strongest MVP.",
        taskGroupId: tg_3.id,
      },
      {
        name: "Competitor analysis",
        description: "mnmmn",
        taskGroupId: tg_3.id,
      },
      {
        name: "Research the market",
        description:
          "We need to get a solid overview of the market to ensure we have up-to-date estimates of market size and demand.",
        taskGroupId: tg_3.id,
      },
      // {
      //   name: "Plan Product Hunt launch",
      //   description: "a s aa aa",
      //   taskGroupId: 4,
      // },
      // {
      //   name: "Share on Show HN",
      //   description: "lkj",
      //   taskGroupId: 4,
      // },
      // {
      //   name: "Write launch article to publish on multiple channels",
      //   description: "ii",
      //   taskGroupId: 4,
      // },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Tasks", null, {});
  },
};
