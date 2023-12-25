const { deleteClient } = require("./utils");

const onUserExitedExercise = (socket) => {
  deleteClient(socket.id);
};

module.exports = { onUserExitedExercise };
