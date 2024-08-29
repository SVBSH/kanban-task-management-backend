const { Board, User, TaskGroup, Sequelize, sequelize } = require("../models");

exports.getAllBoards = async (req, res) => {
  try {
    const boards = await Board.findAll();
    res.json(boards);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving boards", error: error.message });
  }
};

exports.getBoard = async (req, res) => {
  const boardId = req.params.id;

  if (!boardId) {
    return res.status(400).json({ message: "Board ID parameter is missing." });
  }

  try {
    const board = await Board.findByPk(boardId);

    if (!board) {
      return res.status(404).json({ message: "Board not found." });
    }

    res.json(board);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving board.", error: error.message });
  }
};

exports.createBoard = async (req, res) => {
  const { name: boardName, columns: boardColumns } = req.body;

  if (!boardName) {
    return res
      .status(400)
      .json({ message: "Board name parameter is missing." });
  }

  if (!boardColumns || !Array.isArray(boardColumns)) {
    return res
      .status(400)
      .json({ message: "Board columns parameter is missing or not an array." });
  }

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
