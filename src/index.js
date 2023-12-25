const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const {
  onCodeUpdated,
  onDisconnecting,
  onUserEnteredExercise,
  onUserExitedExercise,
} = require("./handlers");
const { getExercises } = require("./api");

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST"],
};

const app = express();
app.use(cors(corsOptions));

const server = http.createServer(app);

const io = new Server(server, { cors: corsOptions });

app.get("/exercises", getExercises);

io.on("connection", (socket) => {
  socket.on("user_entered_exercise", (exerciseId) =>
    onUserEnteredExercise(socket, exerciseId)
  );
  socket.on("code_updated", (data) => onCodeUpdated(socket, data));
  socket.on("user_exited_exercise", () => onUserExitedExercise(socket));
  socket.on("disconnecting", () => onDisconnecting(socket));
});

server.listen(3001, () => {
  console.log("Server is running");
});
