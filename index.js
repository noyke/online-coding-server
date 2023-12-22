const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

let firstClientId = null;
let isFirstEnter = null;
let currCodeId = null;

io.on("connection", (socket) => {
  socket.on("code_enter", (codeId) => {
    firstClientId = currCodeId !== codeId ? null : firstClientId;

    if (!firstClientId) {
      firstClientId = socket.id;
      isFirstEnter = true;
      currCodeId = codeId;
    } else isFirstEnter = false;

    socket.emit("is_first", isFirstEnter);
  });
  socket.on("update_code", (newCode) => {
    socket.broadcast.emit("updated_code", newCode);
  });
});

server.listen(3001, () => {
  console.log("Server is running");
});
