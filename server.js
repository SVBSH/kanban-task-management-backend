const express = require("express");
const { createServer } = require("node:http");
const bodyParser = require("body-parser");

const morgan = require("morgan");
require("dotenv/config");
const { Server } = require("socket.io");

const routeBoards = require("./routes/board.route.js");

const SERVER_PORT = process.env.SERVER_PORT || 3000;

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    // origin: "*",
  },
});

app.use(morgan("dev"));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/boards", routeBoards);

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
