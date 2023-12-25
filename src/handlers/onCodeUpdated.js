const onCodeUpdated = (socket, data) => {
  socket.to(data.id).emit("code_updated", data.newCode);
};

module.exports = { onCodeUpdated };
