const {
  Board,
  User,
  TaskGroup,
  sequelize,
  BoardUser,
  Subtask,
  Task,
} = require("../models");

function getWholeBoardById(boardId, id) {
  return BoardUser.findOne({
    where: { userId: id },
    attributes: ["role"],
    include: [
      {
        model: Board,
        where: { id: boardId },
        attributes: ["id", "name"],
        include: [
          {
            model: TaskGroup,
            attributes: ["id", "name", "createdAt"],
            include: [
              {
                model: Task,
                attributes: ["id", "name", "createdAt"],
                include: [
                  {
                    model: Subtask,
                    attributes: [
                      "id",
                      "title",
                      "taskId",
                      "isCompleted",
                      "createdAt",
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  });
}

exports.getInitialBoards = async (req, res) => {
  const { username, id } = req.user;
  try {
    const userBoards = await BoardUser.findOne({
      where: { userId: id },
      attributes: ["role"],
      include: [
        {
          model: Board,
          attributes: ["id", "name"],
          include: [
            {
              model: TaskGroup,
              attributes: ["id", "name", "createdAt"],
              include: [
                {
                  model: Task,
                  attributes: ["id", "name", "createdAt"],
                  include: [
                    {
                      model: Subtask,
                      attributes: [
                        "id",
                        "title",
                        "taskId",
                        "isCompleted",
                        "createdAt",
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });
    res.json({ data: userBoards });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving boards", error: error.message });
  }
};

exports.apiGetWholeBoardById = async (req, res) => {
  const { username, id } = req.user;
  const boardId = req.params.id;
  console.log(req.params);

  try {
    const userBoards = await getWholeBoardById(boardId, id);
    const formattedBoards = {
      role: userBoards.role,
      id: userBoards.Board.id,
      name: userBoards.Board.name,
      TaskGroups: userBoards.Board.TaskGroups,
    };
    res.json({ data: formattedBoards });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving boards", error: error.message });
  }
};

exports.getAllBoards = async (req, res) => {
  const { _, id } = req.user;

  try {
    const boards = await BoardUser.findAll({
      where: { userId: id },
      attributes: ["role"],
      include: [
        {
          model: Board,
          attributes: ["id", "name"],
        },
      ],
    });

    const formattedBoards = boards.map((boardUser) => ({
      role: boardUser.role,
      id: boardUser.Board.id,
      name: boardUser.Board.name,
    }));
    res.json({ data: formattedBoards });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving boards", error: error });
  }
};

// Get single board
// verify if user has access to this board
exports.getBoard = async (req, res) => {
  const boardId = req.params.id;
  console.log("userId: ", req.user.username, req.user.id);

  try {
    const board = await Board.findByPk(boardId);

    if (!board) {
      return res.status(404).json({ message: "Board not found." });
    }

    res.json({ data: board });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving board.", error: error.message });
  }
};

exports.createBoard = async (req, res) => {
  const { name: boardName, columns: boardColumns } = req.body;

  const uniqueColumns = [...new Set(boardColumns)];
  if (uniqueColumns.length !== boardColumns.length) {
    return res
      .status(409)
      .json({ message: `Board ${boardName} has duplicate column names.` });
  }

  const transaction = await sequelize.transaction();

  try {
    const user_default = await User.findOne({ where: { username: "svato" } });

    if (!user_default) {
      await transaction.rollback();
      return res.status(404).json({ message: "User 'svato' not found." });
    }

    const [newBoard, created] = await Board.findOrCreate({
      where: {
        name: boardName,
        ownerId: user_default.id,
      },
      transaction,
    });

    if (!created) {
      await transaction.rollback();
      return res
        .status(409)
        .json({ message: `Board ${boardName} already exists.` });
    }

    const boardColumnsWithNewBoard = boardColumns.map((columnName) => ({
      name: columnName,
      boardId: newBoard.id,
    }));

    const newTasks = await TaskGroup.bulkCreate(boardColumnsWithNewBoard, {
      transaction,
    });

    await transaction.commit();
    res.status(201).json({ board: newBoard, tasks: newTasks });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({
      message: "Error creating board and tasks",
      error: error.message,
    });
  }
};

// Get All
exports.getBoardInfo = async (req, res) => {
  const userId = req.params.user;
  const userBoards = await BoardUser.findAll({
    where: { userId: userId },
    include: [
      {
        model: Board,
        include: [
          {
            model: TaskGroup,
            include: [
              {
                model: Task,
                include: Subtask,
              },
            ],
          },
        ],
      },
    ],
  });
  console.log(userBoards);

  res.json(userBoards);
  return;
};
