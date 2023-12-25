const { deleteClient } = require("./utils");

const onDisconnecting = (socket) => {
  deleteClient(socket.id);
};

module.exports = { onDisconnecting };
