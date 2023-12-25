const { exercises } = require("./exercises");

const sqlite3 = require("sqlite3").verbose();

class Database {
  constructor() {
    this.db = new sqlite3.Database("database.sqlite", sqlite3.OPEN_READWRITE);
  }

  initTables() {
    this.db.serialize(() =>
      this.db.run(
        "CREATE TABLE IF NOT EXISTS exercises (title TEXT, code TEXT, solution TEXT)"
      )
    );
  }

  InitData() {
    const placeholders = exercises.map(() => "(?, ?, ?)").join(", ");

    this.db.run(
      "INSERT INTO exercises (title, code, solution) VALUES " + placeholders,
      exercises.map((e) => [e.title, e.code, e.solution]).flat()
    );
  }

  getExercises() {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM exercises`;
      const params = [];

      return this.db.all(sql, params, function (err, rows) {
        if (err) {
          console.error("DB Error: Insert failed: ", err.message);
          return reject(err.message);
        }
        return resolve(rows);
      });
    });
  }
}

const database = new Database();

module.exports = { database };
