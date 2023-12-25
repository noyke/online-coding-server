const { database } = require("../db");

const getExercises = async (req, res) => {
  const exercises = await database.getExercises();

  res.send(exercises);
};

module.exports = { getExercises };
