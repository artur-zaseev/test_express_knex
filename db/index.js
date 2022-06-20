const path = require("path");

const db = require("knex")({
  client: "sqlite3",
  connection: {
    filename: path.resolve(__dirname, "mydb.sqlite"),
  },
});

module.exports = { db };
