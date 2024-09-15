const express = require("express");
var cors = require("cors");

const { createServer } = require("node:http");
const bodyParser = require("body-parser");
const { STAGE } = require("./config/index.js");

const morgan = require("morgan");
require("dotenv/config");
const { Server } = require("socket.io");

const routeBoards = require("./routes/board.route.js");
const router = require("./routes/router.js");

const { protect } = require("./modules/auth/auth.js");
const { createNewUser, signin } = require("./handlers/users.js");
const { body, header } = require("express-validator");

const { User } = require("./models");

const SERVER_PORT = process.env.SERVER_PORT || 3000;

const app = express();
app.use(cors());

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(morgan("dev"));
app.use(bodyParser.json());

app.use(
  "/api",
  [
    header("Authorization")
      .exists()
      .withMessage("Authorization header is required"),
    //   .isJWT()
    //   .withMessage("Invalid JWT token"),
    protect,
  ],
  router
);

app.post(
  "/user",
  [
    body("username")
      .notEmpty()
      .trim()
      .custom(async (username) => {
        // Validate uniquenes of username
        const user = await User.findOne({ where: { username: username } });
        if (user) {
          return Promise.reject(`user ${username} is already in use`);
        }
      }),
    body("password").notEmpty().trim(),
  ],
  createNewUser
);

app.post(
  "/signin",
  [body("username").notEmpty(), body("password").notEmpty().trim()],
  signin
);

app.use((err, req, res, next) => {
  if (err.type === "auth") {
    res.status(401).json({ message: "unauthorized" });
  } else if (err.type === "input") {
    res.status(400).json({ message: "invalid input" });
  } else {
    res.status(500).json({ message: "oops, thats an error" });
  }
});

// app.use("/boards", routeBoards);

server.listen(SERVER_PORT, () => {
  console.log(`Example app listening on port ${SERVER_PORT}`);
});

io.on("connection", (socket) => {
  console.log(`socket ${socket.id} connected`);

  socket.on("draw_cursor", function (data) {
    socket.broadcast.emit("draw_cursor", { line: data.line, id: socket.id });
  });

  socket.on("disconnect", (reason) => {
    console.log(`socket ${socket.id} disconnected due to ${reason}`);

    socket.broadcast.emit("rm:draw_cursor", { id: socket.id });
  });
});

io.listen(4000);
