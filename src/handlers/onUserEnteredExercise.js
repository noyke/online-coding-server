const { codePages } = require("./data");
const { deleteDuplicate } = require("./utils");

const onUserEnteredExercise = (socket, exerciseId) => {
  socket.join(exerciseId);
  const index = parseInt(exerciseId) - 1;
  const isFirstEnter = codePages[index].clientsIn.length === 0;
  codePages[index].clientsIn.push(socket.id);
  deleteDuplicate(index);

  socket.emit("is_first", isFirstEnter);
};

module.exports = { onUserEnteredExercise };
