const { Router } = require("express");
const boardController = require("../controller/board.controler.js");
const router = Router();

router.route("/").get(boardController.getAllBoards);
router.route("/:user/initialLoad").get(boardController.getInitialBoards);
router.route("/:id").get(boardController.getBoard);
router.route("/").post(boardController.createBoard);

module.exports = router;
