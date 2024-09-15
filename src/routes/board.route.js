const { Router } = require("express");
const boardController = require("../controller/board.controler.js");
const router = Router();
const { body, param } = require("express-validator");
const { handleInputErrors } = require("../modules/middleware.js");

router.get("/", boardController.getAllBoards);
router.get("/initialLoad", boardController.getInitialBoards);

router.get(
  "/:id",
  [param("id").notEmpty().isInt(), handleInputErrors],
  boardController.getBoard
);
// TODO: extrahovat
router.post(
  "/",
  body("name").isString(),
  //   TODO: check if array contains only strings
  body("columns").isArray(),
  handleInputErrors,
  boardController.createBoard
);
router.route("/:user/:id/all").post(boardController.getBoardInfo);

module.exports = router;

// oneOf([check('status').equals('IN_PROGRESS'), check('status').equals('SHIPPED'), check('status').equals('DEPRECATED')])
