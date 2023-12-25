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

const codePages = [
  { codeId: "1", clientsIn: [] },
  { codeId: "2", clientsIn: [] },
  { codeId: "3", clientsIn: [] },
  { codeId: "4", clientsIn: [] },
];

function deleteDuplicate(index) {
  codePages[index].clientsIn = [...new Set(codePages[index].clientsIn)];
}

function deleteClient(index, socketID) {
  const clientIndex = codePages[index].clientsIn.indexOf(socketID);
  codePages[index].clientsIn.splice(clientIndex, 1);
}

io.on("connection", (socket) => {
  socket.on("code_entered", (id) => {
    socket.join(id);
    const index = parseInt(id) - 1;
    const isFirstEnter = codePages[index].clientsIn.length === 0;
    codePages[index].clientsIn.push(socket.id);
    deleteDuplicate(index);

    socket.emit("is_first", isFirstEnter);
  });

  socket.on("update_code", (data) => {
    socket.to(data.id).emit("updated_code", data.newCode);
  });

  socket.on("code_exit", (id) => {
    const index = parseInt(id) - 1;
    deleteClient(index, socket.id);
  });
});

server.listen(3001, () => {
  console.log("Server is running");
});
