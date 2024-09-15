const { Router } = require("express");
const router = Router();
const routeBoards = require("./board.route.js");

router.use("/boards", routeBoards);
router.route("/").get((req, res) => {
  res.json({ message: "hello" });
});

module.exports = router;
